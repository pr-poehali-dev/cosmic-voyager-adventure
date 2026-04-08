import { useEffect, useState } from "react";
import Icon from "@/components/ui/icon";

const HERO_IMAGE = "https://cdn.poehali.dev/projects/d684a005-0838-40c8-bd58-3dcf97271270/files/0baf8008-b172-4055-8d31-bf4272d80799.jpg";

const MENU_ITEMS = [
  { category: "Закуски", emoji: "🧀", name: "Сырная тарелка", desc: "5 видов выдержанного сыра с мёдом и орехами", price: "690 ₽" },
  { category: "Закуски", emoji: "🥩", name: "Брускетты с тартаром", desc: "Говяжий тартар, каперсы, желток перепела", price: "590 ₽" },
  { category: "Горячее", emoji: "🍖", name: "Рёбра BBQ", desc: "Медленное томление 8 часов, соус chipotle", price: "1 290 ₽" },
  { category: "Горячее", emoji: "🍔", name: "Ретро-бургер", desc: "Двойная котлета, бекон, соус 1000 островов", price: "890 ₽" },
  { category: "Коктейли", emoji: "🍸", name: "Old Fashioned", desc: "Бурбон, биттер, тростниковый сахар, апельсин", price: "650 ₽" },
  { category: "Коктейли", emoji: "🥃", name: "Smoky Negroni", desc: "Джин, кампари, вермут, копчёный лёд", price: "720 ₽" },
];

const Index = () => {
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [visibleSections, setVisibleSections] = useState<Record<string, boolean>>({});
  const [booking, setBooking] = useState({ name: "", phone: "", date: "", guests: "2", time: "20:00" });
  const [bookingDone, setBookingDone] = useState(false);
  const [menuFilter, setMenuFilter] = useState("Все");

  useEffect(() => {
    const confirmed = sessionStorage.getItem("age_confirmed");
    if (confirmed) setAgeConfirmed(true);
  }, []);

  useEffect(() => {
    if (!ageConfirmed) return;
    const observers: Record<string, IntersectionObserver> = {};
    const sectionIds = ["hero", "menu", "booking", "cta"];
    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (!element) return;
      observers[id] = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => ({ ...prev, [id]: true }));
            observers[id].unobserve(element);
          }
        },
        { threshold: 0.1 }
      );
      observers[id].observe(element);
    });
    return () => Object.values(observers).forEach((o) => o.disconnect());
  }, [ageConfirmed]);

  const handleAgeConfirm = () => {
    sessionStorage.setItem("age_confirmed", "true");
    setAgeConfirmed(true);
  };

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingDone(true);
  };

  const categories = ["Все", "Закуски", "Горячее", "Коктейли"];
  const filtered = menuFilter === "Все" ? MENU_ITEMS : MENU_ITEMS.filter((i) => i.category === menuFilter);

  if (!ageConfirmed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${HERO_IMAGE})` }}
        />
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative z-10 max-w-md w-full text-center">
          <div className="p-10 border border-accent/30 rounded-3xl bg-black/80 backdrop-blur-xl">
            <div className="w-20 h-20 rounded-full bg-accent/10 border-2 border-accent/40 flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl font-black text-accent">21+</span>
            </div>
            <h1 className="text-4xl font-display font-black mb-3 bg-gradient-to-r from-white to-accent/60 bg-clip-text text-transparent">
              Ретро-клуб
            </h1>
            <div className="w-16 h-0.5 bg-accent/40 mx-auto mb-6" />
            <p className="text-muted-foreground mb-2 text-base leading-relaxed">
              Добро пожаловать. Этот сайт содержит информацию о заведении, где продаётся алкоголь.
            </p>
            <p className="text-white/60 text-sm mb-8">Вам уже исполнился 21 год?</p>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleAgeConfirm}
                className="w-full px-8 py-4 bg-gradient-to-r from-accent to-accent/80 text-black rounded-full font-bold text-lg hover:shadow-xl hover:shadow-accent/30 transition-all"
              >
                Да, мне есть 21
              </button>
              <button className="w-full px-8 py-4 border border-white/10 text-white/50 rounded-full font-medium text-sm hover:border-white/20 transition-all">
                Нет, мне нет 21
              </button>
            </div>
            <p className="text-white/30 text-xs mt-6">
              Нажимая «Да», вы подтверждаете свой возраст и соглашаетесь с правилами заведения
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 w-full bg-background/80 backdrop-blur-2xl border-b border-accent/20 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="font-display font-black text-2xl tracking-tighter bg-gradient-to-r from-white via-accent to-accent/80 bg-clip-text text-transparent">
            Ретро-клуб
          </div>
          <nav className="hidden md:flex gap-10 text-sm font-medium">
            <a href="#menu" className="text-muted-foreground hover:text-white transition-colors">Меню</a>
            <a href="#booking" className="text-muted-foreground hover:text-white transition-colors">Бронирование</a>
            <a href="#cta" className="text-muted-foreground hover:text-white transition-colors">Контакты</a>
          </nav>
          <a
            href="#booking"
            className="px-5 py-2.5 text-sm font-semibold bg-gradient-to-r from-accent to-accent/80 text-black rounded-full hover:shadow-lg hover:shadow-accent/40 transition-all"
          >
            Забронировать
          </a>
        </div>
      </header>

      {/* Hero */}
      <section id="hero" className="relative min-h-screen flex items-center px-6 pt-20 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${HERO_IMAGE})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <div
            className={`max-w-2xl transition-all duration-1000 ${visibleSections["hero"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent/30 bg-black/50">
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              <span className="text-xs font-medium tracking-widest text-accent uppercase">Открыто сегодня · с 18:00 до 03:00</span>
            </div>
            <h1 className="text-6xl lg:text-8xl font-display font-black leading-none mb-6 tracking-tighter">
              <span className="bg-gradient-to-br from-white via-white to-white/50 bg-clip-text text-transparent">
                Место,<br />где время
              </span>
              <br />
              <span className="text-accent">идёт назад.</span>
            </h1>
            <p className="text-xl text-white/70 leading-relaxed mb-10 max-w-lg font-light">
              Атмосфера 70-х, живая музыка по пятницам, авторские коктейли и кухня, о которой не забывают.
            </p>
            <div className="flex gap-4 flex-col sm:flex-row">
              <a
                href="#booking"
                className="group px-8 py-4 bg-gradient-to-r from-accent to-accent/90 text-black rounded-full hover:shadow-2xl hover:shadow-accent/50 transition-all font-bold text-lg flex items-center gap-3 justify-center"
              >
                Забронировать стол
                <Icon name="ArrowRight" size={20} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#menu"
                className="px-8 py-4 border border-white/30 rounded-full hover:border-accent/60 hover:bg-accent/10 transition-all font-medium text-lg text-white flex items-center gap-3 justify-center"
              >
                <Icon name="UtensilsCrossed" size={18} />
                Смотреть меню
              </a>
            </div>
            <div className="grid grid-cols-3 gap-8 pt-10 mt-10 border-t border-white/10 max-w-lg">
              <div>
                <div className="text-2xl font-bold text-accent mb-1">7 лет</div>
                <p className="text-sm text-white/50">На рынке</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-white mb-1">40+</div>
                <p className="text-sm text-white/50">Позиций меню</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-accent mb-1">Live</div>
                <p className="text-sm text-white/50">Музыка пт-сб</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Menu */}
      <section id="menu" className="py-32 px-6 bg-accent/5">
        <div className="max-w-7xl mx-auto">
          <div
            className={`text-center mb-14 transition-all duration-1000 ${visibleSections["menu"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <span className="text-xs font-medium tracking-widest text-accent/60 uppercase">Наше меню</span>
            <h2 className="text-5xl lg:text-6xl font-display font-black tracking-tighter mt-4 mb-4">
              <span className="bg-gradient-to-r from-white via-white to-accent/40 bg-clip-text text-transparent">
                Еда и напитки
              </span>
            </h2>
            <p className="text-muted-foreground text-lg font-light">Кухня открыта до 02:00</p>
          </div>

          <div className="flex gap-3 justify-center mb-10 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setMenuFilter(cat)}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                  menuFilter === cat
                    ? "bg-accent text-black"
                    : "border border-accent/20 text-white/60 hover:border-accent/40 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item, i) => (
              <div
                key={i}
                className={`group p-6 border border-accent/10 hover:border-accent/40 rounded-2xl bg-card/50 hover:bg-card/80 transition-all duration-500 backdrop-blur-sm ${
                  visibleSections["menu"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="text-4xl">{item.emoji}</div>
                  <span className="text-xs text-accent/60 border border-accent/20 rounded-full px-3 py-1">{item.category}</span>
                </div>
                <h3 className="font-display font-bold text-lg text-white mb-1">{item.name}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">{item.desc}</p>
                <div className="text-accent font-bold text-lg">{item.price}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking */}
      <section id="booking" className="py-32 px-6">
        <div className="max-w-3xl mx-auto">
          <div
            className={`text-center mb-14 transition-all duration-1000 ${visibleSections["booking"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <span className="text-xs font-medium tracking-widest text-accent/60 uppercase">Бронирование</span>
            <h2 className="text-5xl lg:text-6xl font-display font-black tracking-tighter mt-4 mb-4">
              <span className="bg-gradient-to-r from-white via-white to-accent/40 bg-clip-text text-transparent">
                Забронировать стол
              </span>
            </h2>
            <p className="text-muted-foreground font-light">Предоплата не требуется</p>
          </div>

          <div
            className={`relative transition-all duration-1000 ${visibleSections["booking"] ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-accent/20 via-accent/10 to-accent/20 rounded-3xl blur-xl" />
            <div className="relative p-8 md:p-12 border border-accent/20 rounded-2xl bg-card/80 backdrop-blur-xl">
              {bookingDone ? (
                <div className="text-center py-10">
                  <div className="w-20 h-20 rounded-full bg-accent/10 border-2 border-accent/40 flex items-center justify-center mx-auto mb-6">
                    <Icon name="Check" size={36} className="text-accent" />
                  </div>
                  <h3 className="text-3xl font-display font-black text-white mb-3">Стол забронирован!</h3>
                  <p className="text-muted-foreground mb-2">Мы свяжемся с вами для подтверждения в течение 15 минут.</p>
                  <p className="text-accent font-medium">{booking.date} · {booking.time} · {booking.guests} гостей</p>
                  <button
                    onClick={() => setBookingDone(false)}
                    className="mt-8 px-6 py-3 border border-accent/30 text-white rounded-full text-sm hover:bg-accent/10 transition"
                  >
                    Забронировать ещё раз
                  </button>
                </div>
              ) : (
                <form onSubmit={handleBooking} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm text-white/60 mb-2 block">Ваше имя</label>
                      <input
                        required
                        type="text"
                        placeholder="Иван Иванов"
                        value={booking.name}
                        onChange={(e) => setBooking({ ...booking, name: e.target.value })}
                        className="w-full px-4 py-3 bg-black/40 border border-accent/20 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-accent/60 transition"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-white/60 mb-2 block">Телефон</label>
                      <input
                        required
                        type="tel"
                        placeholder="+7 (999) 000-00-00"
                        value={booking.phone}
                        onChange={(e) => setBooking({ ...booking, phone: e.target.value })}
                        className="w-full px-4 py-3 bg-black/40 border border-accent/20 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-accent/60 transition"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-white/60 mb-2 block">Дата</label>
                      <input
                        required
                        type="date"
                        value={booking.date}
                        min={new Date().toISOString().split("T")[0]}
                        onChange={(e) => setBooking({ ...booking, date: e.target.value })}
                        className="w-full px-4 py-3 bg-black/40 border border-accent/20 rounded-xl text-white focus:outline-none focus:border-accent/60 transition"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-white/60 mb-2 block">Время</label>
                      <select
                        value={booking.time}
                        onChange={(e) => setBooking({ ...booking, time: e.target.value })}
                        className="w-full px-4 py-3 bg-black/40 border border-accent/20 rounded-xl text-white focus:outline-none focus:border-accent/60 transition"
                      >
                        {["18:00", "19:00", "20:00", "21:00", "22:00", "23:00", "00:00"].map((t) => (
                          <option key={t} value={t} className="bg-black">{t}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-white/60 mb-3 block">Количество гостей</label>
                    <div className="flex gap-3 flex-wrap">
                      {["1", "2", "3", "4", "5", "6", "7+"].map((n) => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setBooking({ ...booking, guests: n })}
                          className={`w-12 h-12 rounded-xl text-sm font-bold transition-all ${
                            booking.guests === n
                              ? "bg-accent text-black"
                              : "border border-accent/20 text-white/60 hover:border-accent/40 hover:text-white"
                          }`}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-accent to-accent/80 text-black rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-accent/30 transition-all flex items-center justify-center gap-3"
                  >
                    <Icon name="CalendarCheck" size={20} />
                    Подтвердить бронирование
                  </button>
                  <p className="text-center text-white/30 text-xs">
                    Мы перезвоним для подтверждения. Бронь без предоплаты.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Contacts */}
      <section id="cta" className="py-32 px-6 bg-accent/5 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-accent/10 rounded-full blur-3xl pointer-events-none" />
        <div
          className={`max-w-4xl mx-auto text-center relative z-10 transition-all duration-1000 ${visibleSections["cta"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <h2 className="text-5xl lg:text-6xl font-display font-black tracking-tighter mb-6">
            <span className="bg-gradient-to-r from-white via-white to-accent/40 bg-clip-text text-transparent">
              Приходите сегодня
            </span>
          </h2>
          <p className="text-xl text-muted-foreground mb-12 font-light max-w-2xl mx-auto">
            Живая музыка по пятницам и субботам. Кухня до 02:00. Вход только 21+.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              { icon: "MapPin", title: "Адрес", value: "ул. Пушкина, 12\nМосква" },
              { icon: "Clock", title: "Режим работы", value: "Вт–Чт 18:00–01:00\nПт–Сб 18:00–03:00" },
              { icon: "Phone", title: "Телефон", value: "+7 (495) 000-00-00" },
            ].map((c, i) => (
              <div key={i} className="p-6 border border-accent/10 rounded-2xl bg-card/50 text-center">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <Icon name={c.icon} size={22} className="text-accent" fallback="Info" />
                </div>
                <h4 className="text-white/60 text-sm mb-2">{c.title}</h4>
                <p className="text-white font-medium whitespace-pre-line">{c.value}</p>
              </div>
            ))}
          </div>

          <a
            href="#booking"
            className="group inline-flex px-10 py-5 bg-gradient-to-r from-accent to-accent/90 text-black rounded-full hover:shadow-2xl hover:shadow-accent/40 transition-all font-bold text-lg items-center gap-3"
          >
            Забронировать стол
            <Icon name="ArrowRight" size={20} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-accent/10 py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <div>
            <span className="font-display font-bold text-white">Ретро-клуб</span>
            <span className="ml-2">© 2025 · Вход только 21+</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Правила заведения</a>
            <a href="#" className="hover:text-white transition-colors">Конфиденциальность</a>
            <a href="#" className="hover:text-white transition-colors">Контакты</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
