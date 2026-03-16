import MessagesSkeleton from "@/components/skeletons/MessagesSkeleton";

export default function LoadingMessages() {
  return (
    <div className="min-h-screen px-6 py-16">
      <div className="mx-auto w-full max-w-5xl">
        <MessagesSkeleton />
      </div>
    </div>
  );
}
