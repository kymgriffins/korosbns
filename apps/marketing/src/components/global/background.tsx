import styles from "./background.module.css";

const Background = () => {
  return (
    <div className="absolute left-0 top-0 z-0 h-dvh w-full overflow-hidden">
      <div className="absolute inset-x-0 top-0 mx-auto h-1/4 w-1/4 bg-primary/30 blur-[8rem]" />
      <div className={styles.dotGrid} aria-hidden />
    </div>
  );
};

export default Background;
