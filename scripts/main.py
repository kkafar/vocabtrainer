#!/usr/bin/env python3.12

import argparse
from collections.abc import Callable, Mapping
import json
from pathlib import Path
from dataclasses import dataclass, field, asdict
from sys import stdout
from typing import Optional, Any
from datetime import date, datetime


@dataclass
class Args:
    files: list[Path]
    stdout: bool
    camel_case: bool
    pretty: bool


@dataclass
class ArgsValidationResult[T]:
    success: bool
    errors: Optional[list[str]]
    args: T


@dataclass
class VocabItem:
    # Word / expression / ...
    text: str
    created_date: datetime
    last_updated_date: datetime
    translation: Optional[str] = field(default=None)


type GroupName = str


@dataclass
class Group:
    name: GroupName
    description: Optional[str]
    created_date: datetime


@dataclass
class VocabFileModel:
    entities: list[VocabItem] = field(default_factory=list)
    group: Optional[Group] = None


def normalize_key(key: str) -> str:
    parts = key.split("_")

    if len(parts) == 0:
        raise ValueError("Received empty split result!")

    if len(parts) == 1:
        return key

    output_parts = [parts[0]]
    for part in parts[1:]:
        if len(part) == 0:
            raise ValueError("Received empty part")

        camel_cased_part = part[0].upper() + part[1:]
        output_parts.append(camel_cased_part)

    return "".join(output_parts)


def normalize_value(value: Any) -> Any:
    if isinstance(value, dict):
        return normalize_to_camel_case(value)
    if isinstance(value, list):
        return [normalize_value(nested_value) for nested_value in value]
    return value


def normalize_to_camel_case(mapping: Mapping[str, Any]) -> Mapping[str, Any]:
    return {
        normalize_key(key): normalize_value(value) for key, value in mapping.items()
    }


def normalize_identity(mapping: Mapping[str, Any]) -> Mapping[str, Any]:
    return mapping


def build_cli():
    parser = argparse.ArgumentParser(
        prog="Converter",
        description="Convert txt lesson into json",
    )

    parser.add_argument("files", nargs="+", help="List of files to convert", type=Path)
    parser.add_argument(
        "--stdout",
        action="store_true",
        default=False,
        required=False,
        help="If set, the output will be printed to stdout instead of individual files",
    )
    parser.add_argument(
        "--camel-case",
        action="store_true",
        default=False,
        required=False,
        help="The keys in output JSON should be in CamelCase",
    )
    parser.add_argument(
        "--pretty",
        default=True,
        required=False,
        action=argparse.BooleanOptionalAction,
        help="Format output JSON",
    )

    return parser


def validate_args(args: Optional[argparse.Namespace]) -> ArgsValidationResult:
    if args is None:
        return ArgsValidationResult(False, ["Received None arguments"], args)

    if args.files is None:
        return ArgsValidationResult(False, ["Received nullish file list"], args)

    for filepath in args.files:
        if not isinstance(filepath, Path):
            return ArgsValidationResult(
                False, [f"Invalid argument type {type(filepath)}"], args
            )

        if not filepath.is_file():
            return ArgsValidationResult(False, [f"{filepath} is not a file"], args)

    return ArgsValidationResult(True, None, args)


def parse_line(raw_entity: str) -> Optional[VocabItem]:
    partitioned = raw_entity.split(" - ")
    partitioned = list(map(str.strip, partitioned))
    # print(partitioned)

    creation_date = datetime.now().astimezone()
    if len(partitioned) == 2:
        stripped_text = partitioned[0].strip()
        stripped_translation = partitioned[1].strip()
        if len(stripped_text) == 0 and len(stripped_translation) == 0:
            return None
        else:
            return VocabItem(
                text=stripped_text,
                translation=stripped_translation,
                created_date=creation_date,
                last_updated_date=creation_date,
            )
    elif len(partitioned) == 1:
        stripped_text = partitioned[0].strip()
        if len(stripped_text) == 0:
            return None
        else:
            return VocabItem(
                text=stripped_text,
                created_date=creation_date,
                last_updated_date=creation_date,
            )
    else:
        raise ValueError(f"Unexpected format of raw line: {raw_entity}")


def build_file_model(contents: list[str], group_name: str) -> VocabFileModel:
    collector = []
    for line in contents:
        entity = parse_line(line)
        if entity:
            collector.append(entity)

    group = Group(group_name, None, datetime.now().astimezone())
    return VocabFileModel(collector, group=group)


def process_file(file: Path) -> VocabFileModel:
    with open(file, "r") as reader:
        contents = reader.readlines()

    if contents is None:
        raise RuntimeError(f"Failed to read contents of file {file}")

    group_name = file.stem
    model = build_file_model(contents, group_name)
    return model


def datetime_serializer(maybe_datetime: Any):
    if isinstance(maybe_datetime, (date, datetime)):
        return maybe_datetime.isoformat()
    else:
        raise TypeError(f"Received object of unexpected type: {type(maybe_datetime)}")


def process_filelist(files: list[Path]) -> list[VocabFileModel]:
    return list(map(process_file, files))


def save_to_disk(
    files: list[Path],
    item_groups: list[VocabFileModel],
    conversion_fn: Callable[[Any], Mapping[str, Any]] = asdict,
):
    for item_group_path, item_group_model in zip(files, item_groups):
        converted_path = item_group_path.with_suffix(".json")
        with open(converted_path, "w+", encoding="utf-8") as writer:
            # We need to pass `default` to ensure dates are converted properly.
            # Without `ensure_ascii=False` polish / german characters won't be converted correctly.
            json.dump(
                conversion_fn(item_group_model),
                writer,
                indent=2,
                default=datetime_serializer,
                ensure_ascii=False,
            )


def print_to_stdout(
    files: list[Path],
    item_groups: list[VocabFileModel],
    conversion_fn: Callable[[Any], Mapping[str, Any]] = asdict,
    pretty_print: bool = True,
):
    indentation = 2 if pretty_print else None
    json.dump(
        list(map(conversion_fn, item_groups)),
        stdout,
        indent=indentation,
        default=datetime_serializer,
        ensure_ascii=False,
    )


def main():
    parseResult: ArgsValidationResult[Args] = validate_args(build_cli().parse_args())

    if not parseResult.success:
        print(parseResult.errors)
        exit(1)

    args = parseResult.args

    item_groups = process_filelist(args.files)

    normalisation_fn = (
        normalize_to_camel_case if args.camel_case else normalize_identity
    )

    def conversion_fn(obj):
        return normalisation_fn(asdict(obj))

    if parseResult.args.stdout:
        print_to_stdout(args.files, item_groups, conversion_fn, args.pretty)
    else:
        save_to_disk(args.files, item_groups, conversion_fn)


if __name__ == "__main__":
    main()
