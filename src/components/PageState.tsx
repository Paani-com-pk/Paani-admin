type PageStateProps = {
  title: string;
  message: string;
  tone?: "default" | "error";
};

export function PageState({ title, message, tone = "default" }: PageStateProps) {
  return (
    <section className={`panel state-panel${tone === "error" ? " error" : ""}`}>
      <h3>{title}</h3>
      <p className="muted">{message}</p>
    </section>
  );
}
