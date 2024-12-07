import styles from "./styles.module.css";

export default function FullScreenContainer({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={styles.fullScreenContainer}>
      {children}
    </div>
  );
}
