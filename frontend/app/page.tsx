import styles from "@/app/styles.module.css";
import VocabList from "./ui/VocabList";

export default function Home() {
  return (
    <div className={styles.topLevelContainer}>
      <VocabList />
    </div>
  );
}
