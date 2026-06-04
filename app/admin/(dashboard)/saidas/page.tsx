import { getMonthData } from "./actions";
import CalendarView from "./CalendarView";

export const revalidate = 0;

export default async function AdminSaidas() {
  const initialDate = new Date().toISOString();
  const initialData = await getMonthData(initialDate);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-heading text-brand-white uppercase mb-2">Saídas e Calendário</h1>
        <p className="text-brand-gray-text">Gere as saídas diárias, bloqueia datas e adiciona horários extra.</p>
      </div>

      <CalendarView initialData={initialData} initialDate={initialDate} />
    </div>
  );
}
