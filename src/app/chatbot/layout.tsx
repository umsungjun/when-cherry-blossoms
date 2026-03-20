export default function ChatbotLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* 채팅 페이지에서는 푸터를 숨겨 뷰포트를 꽉 채움 */}
      <style>{`footer { display: none !important; }`}</style>
      {children}
    </>
  );
}
