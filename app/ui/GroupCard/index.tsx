import { VocabularyItemGroup } from "@/app/lib/definitions";
import FlexibleCard from "../FlexibleCard";
import { isStringBlank } from "@/app/lib/text-util";
import styles from './styles.module.css';
import clsx from "clsx";

export type GroupCardProps = {
  group: VocabularyItemGroup;
}

function GroupName({ name }: { name: VocabularyItemGroup['name'] }) {
  return (
    <div className={styles.groupName}>
      {name}
    </div>
  );
}

function GroupMetadata({ group, count }: { group: GroupCardProps['group'], count: number }) {
  const timestamp = Date.parse(group.createdDate);
  const dateInstance = new Date();
  dateInstance.setTime(timestamp);
  const dateString = `${dateInstance.getDay()}.${dateInstance.getMonth()}.${dateInstance.getFullYear()}`;

  return (
    <div className={styles.metadataContainer}>
      {dateString} / {count} item{count > 1 ? 's' : ''}
    </div>
  );
}

export default async function GroupCard({ group }: GroupCardProps) {
  const description = isStringBlank(group.description) ? "No description provided." : group.description;

  return (
    <FlexibleCard>
      <div className={styles.container}>
        <div className={styles.horizontalSpacer}>
          <GroupName name={group.name} />
          <GroupMetadata group={group} count={10} />
        </div>
      </div>
      <div className={clsx(styles.container, styles.metadataFont)}>
        {description}
      </div>
    </FlexibleCard>
  );
}
