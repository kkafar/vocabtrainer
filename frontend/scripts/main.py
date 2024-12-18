import argparse
import json
from pathlib import Path
from dataclasses import dataclass, field, asdict
from typing import Optional, Any
from datetime import date, datetime


@dataclass
class Args:
    files: list[Path]


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


def build_cli():
    parser = argparse.ArgumentParser(
        prog='Converter',
        description='Convert txt lesson into json',
    )

    parser.add_argument('files', nargs='+', help='List of files to convert', type=Path)

    return parser


def validate_args(args: Optional[argparse.Namespace]) -> ArgsValidationResult:
    if args is None:
        return ArgsValidationResult(False, ["Received None arguments"], args)

    if args.files is None:
        return ArgsValidationResult(False, ["Received nullish file list"], args)

    for filepath in args.files:
        if not isinstance(filepath, Path):
            return ArgsValidationResult(False, [f"Invalid argument type {type(filepath)}"], args)

        if not filepath.is_file():
            return ArgsValidationResult(False, [f"{filepath} is not a file"], args)

    return ArgsValidationResult(True, None, args)


def parse_line(raw_entity: str) -> Optional[VocabItem]:
    partitioned = raw_entity.split(' - ')
    partitioned = list(map(str.strip, partitioned))
    print(partitioned)

    creation_date = datetime.now()
    if len(partitioned) == 2:
        stripped_text = partitioned[0].strip()
        stripped_translation = partitioned[1].strip()
        if len(stripped_text) == 0 and len(stripped_translation) == 0:
            return None
        else:
            return VocabItem(text=stripped_text, translation=stripped_translation, created_date=creation_date, last_updated_date=creation_date)
    elif len(partitioned) == 1:
        stripped_text = partitioned[0].strip()
        if len(stripped_text) == 0:
            return None
        else:
            return VocabItem(text=stripped_text, created_date=creation_date, last_updated_date=creation_date)
    else:
        raise ValueError(f"Unexpected format of raw line: {raw_entity}")


def build_file_model(contents: list[str], group_name: str) -> VocabFileModel:
    collector = []
    for line in contents:
        entity = parse_line(line)
        if entity:
            collector.append(entity)

    group = Group(group_name, None, datetime.now())
    return VocabFileModel(collector, group=group)


def process_file(file: Path) -> VocabFileModel:
    with open(file, 'r') as reader:
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
    lessons = list(map(process_file, files))
    for lesson in lessons:
        print(lesson)

    for (lesson_path, lesson_model) in zip(files, lessons):
        converted_path = lesson_path.with_suffix('.json')
        with open(converted_path, 'w+', encoding='utf-8') as writer:
            # We need to pass `default` to ensure dates are converted properly.
            # Without `ensure_ascii=False` polish / german characters won't be converted correctly.
            json.dump(asdict(lesson_model), writer, indent=2, default=datetime_serializer, ensure_ascii=False)

    return lessons


def main():
    parseResult: ArgsValidationResult = validate_args(build_cli().parse_args())

    if not parseResult.success:
        print(parseResult.errors)
        exit(1)

    lessons = process_filelist(parseResult.args.files)




if __name__ == '__main__':
    main()
