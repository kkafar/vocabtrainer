import { ChildrenProp } from "../types";
import st from "./st.module.css";

export default function FlexibleCard({ children }: ChildrenProp) {
  return (
    <div className={st.cardBackground}>
      {children}
    </div>
  );
}
