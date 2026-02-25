import PageHeader from "../../components/PageHeader";
import { useAuthStore } from "../../store/useAuthStore";

export default function NotificationsPage() {
  const notifications = useAuthStore((state) => state.notifications);
  const markRead = useAuthStore((state) => state.markNotificationRead);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Notifications"
        subtitle="Stay informed about consultation updates and payments."
      />

      <div className="grid gap-4">
        {notifications.length === 0 ? (
          <div className="card text-sm text-dusk/70">No notifications.</div>
        ) : (
          notifications.map((note) => (
            <div key={note.id} className="card space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-ink">{note.title}</h3>
                <span className={`tag ${note.read ? "bg-frost text-dusk" : "bg-mint/30 text-ink"}`}>
                  {note.read ? "Read" : "New"}
                </span>
              </div>
              <p className="text-sm text-dusk/70">{note.message}</p>
              <p className="text-xs text-dusk/60">
                {note.createdAt ? new Date(note.createdAt).toLocaleString() : ""}
              </p>
              {!note.read ? (
                <button className="button-secondary" onClick={() => markRead(note.id)}>
                  Mark as read
                </button>
              ) : null}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
