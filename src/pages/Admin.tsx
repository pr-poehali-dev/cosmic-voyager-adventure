import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

const API_URL = "https://functions.poehali.dev/5b7ee685-b67c-4e74-8c3f-2c821b9b238a";

type Booking = {
  id: number;
  name: string;
  phone: string;
  date: string;
  time: string;
  guests: string;
  status: string;
  created_at: string;
};

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  new: { label: "Новая", color: "bg-accent/20 text-accent border-accent/30" },
  confirmed: { label: "Подтверждена", color: "bg-green-500/20 text-green-400 border-green-500/30" },
  cancelled: { label: "Отменена", color: "bg-red-500/20 text-red-400 border-red-500/30" },
  completed: { label: "Завершена", color: "bg-white/10 text-white/50 border-white/20" },
};

const Admin = () => {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [error, setError] = useState("");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");

  const login = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "1968") {
      setAuthed(true);
      setError("");
      loadBookings("1968");
    } else {
      setError("Неверный пароль");
    }
  };

  const loadBookings = async (pwd: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}?password=${pwd}`);
      const data = await res.json();
      const parsed = typeof data === "string" ? JSON.parse(data) : data;
      setBookings(parsed.bookings || []);
    } catch {
      setError("Ошибка загрузки данных");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    await fetch(`${API_URL}?password=1968`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    loadBookings("1968");
  };

  const filtered = filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  const counts = {
    all: bookings.length,
    new: bookings.filter((b) => b.status === "new").length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
    completed: bookings.filter((b) => b.status === "completed").length,
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/30 flex items-center justify-center mx-auto mb-4">
              <Icon name="Lock" size={28} className="text-accent" />
            </div>
            <h1 className="text-2xl font-display font-black text-white">Панель администратора</h1>
            <p className="text-muted-foreground text-sm mt-1">Ретро-клуб</p>
          </div>
          <form onSubmit={login} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-card border border-accent/20 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-accent/60 transition text-center text-lg tracking-widest"
              />
              {error && <p className="text-red-400 text-sm text-center mt-2">{error}</p>}
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-accent to-accent/80 text-black rounded-xl font-bold text-base hover:shadow-xl hover:shadow-accent/30 transition-all"
            >
              Войти
            </button>
          </form>
          <p className="text-center mt-6">
            <a href="/" className="text-muted-foreground text-sm hover:text-white transition-colors">
              ← Вернуться на сайт
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-accent/20 px-6 py-4 flex justify-between items-center bg-card/50">
        <div>
          <div className="font-display font-black text-xl text-white">Панель администратора</div>
          <p className="text-muted-foreground text-xs">Ретро-клуб · Бронирования</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => loadBookings("1968")}
            className="flex items-center gap-2 px-4 py-2 border border-accent/20 rounded-lg text-sm text-white/70 hover:text-white hover:border-accent/40 transition"
          >
            <Icon name="RefreshCw" size={14} />
            Обновить
          </button>
          <a
            href="/"
            className="text-muted-foreground text-sm hover:text-white transition-colors"
          >
            На сайт →
          </a>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { key: "new", label: "Новых", icon: "Bell" },
            { key: "confirmed", label: "Подтверждено", icon: "CheckCircle" },
            { key: "completed", label: "Завершено", icon: "Archive" },
            { key: "cancelled", label: "Отменено", icon: "XCircle" },
          ].map((s) => (
            <div key={s.key} className="p-4 border border-accent/10 rounded-xl bg-card/50">
              <div className="flex items-center gap-2 mb-2">
                <Icon name={s.icon} size={16} className="text-accent/60" fallback="Circle" />
                <span className="text-xs text-muted-foreground">{s.label}</span>
              </div>
              <div className="text-3xl font-black text-white">{counts[s.key as keyof typeof counts]}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {[
            { key: "all", label: `Все (${counts.all})` },
            { key: "new", label: `Новые (${counts.new})` },
            { key: "confirmed", label: `Подтверждены (${counts.confirmed})` },
            { key: "cancelled", label: `Отменены (${counts.cancelled})` },
            { key: "completed", label: `Завершены (${counts.completed})` },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filter === f.key
                  ? "bg-accent text-black"
                  : "border border-accent/20 text-white/60 hover:border-accent/40 hover:text-white"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center py-20 text-muted-foreground">Загрузка...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 border border-accent/10 rounded-2xl">
            <Icon name="CalendarX" size={40} className="text-accent/30 mx-auto mb-4" />
            <p className="text-muted-foreground">Броней пока нет</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((b) => (
              <div
                key={b.id}
                className="p-5 border border-accent/10 hover:border-accent/20 rounded-xl bg-card/50 transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-accent font-bold text-sm">#{b.id}</span>
                    </div>
                    <div>
                      <div className="font-bold text-white text-base">{b.name}</div>
                      <div className="text-muted-foreground text-sm">{b.phone}</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center gap-1.5 text-white/70">
                      <Icon name="Calendar" size={14} className="text-accent/60" />
                      {b.date}
                    </div>
                    <div className="flex items-center gap-1.5 text-white/70">
                      <Icon name="Clock" size={14} className="text-accent/60" />
                      {b.time}
                    </div>
                    <div className="flex items-center gap-1.5 text-white/70">
                      <Icon name="Users" size={14} className="text-accent/60" />
                      {b.guests} гостей
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${
                        STATUS_LABELS[b.status]?.color || "bg-white/10 text-white/50 border-white/20"
                      }`}
                    >
                      {STATUS_LABELS[b.status]?.label || b.status}
                    </span>
                    <select
                      value={b.status}
                      onChange={(e) => updateStatus(b.id, e.target.value)}
                      className="px-3 py-1.5 bg-black/40 border border-accent/20 rounded-lg text-white text-xs focus:outline-none focus:border-accent/60 transition"
                    >
                      <option value="new" className="bg-black">Новая</option>
                      <option value="confirmed" className="bg-black">Подтверждена</option>
                      <option value="cancelled" className="bg-black">Отменена</option>
                      <option value="completed" className="bg-black">Завершена</option>
                    </select>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-white/5 text-xs text-white/30">
                  Заявка получена: {new Date(b.created_at).toLocaleString("ru-RU")}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
