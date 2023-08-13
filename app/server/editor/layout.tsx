import PyodideLoader from "./PyodideLoader";

export default function ServerEditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PyodideLoader />
      {children}
    </>
  );
}
