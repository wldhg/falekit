import MobileDetector from "@/_components/MobileDetector";
import styles from "./page.module.css";

const MainPage = () => {
  return (
    <main className={styles.main}>
      <MobileDetector />
    </main>
  );
};

export default MainPage;
