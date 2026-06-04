import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

export const revalidate = 0;

export default async function EditTour({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  const supabase = await createClient();

  const { data: tour, error } = await supabase
    .from("tours_config")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !tour) {
    return (
      <div className="p-8">
        <div className="bg-red-500/10 text-red-500 p-4 rounded">Tour não encontrado.</div>
        <Link href="/admin/tours" className="mt-4 inline-block text-brand-orange">
          Voltar
        </Link>
      </div>
    );
  }

  async function updateTour(formData: FormData) {
    "use server";
    const supabase = await createClient();

    const name = formData.get("name") as string;
    const duration = formData.get("duration") as string;
    const price_2_seater = parseFloat(formData.get("price_2_seater") as string);
    const price_4_seater = parseFloat(formData.get("price_4_seater") as string);
    const is_active = formData.get("is_active") === "on";

    await supabase
      .from("tours_config")
      .update({
        name,
        duration,
        price_2_seater,
        price_4_seater,
        is_active,
      })
      .eq("id", id);

    revalidatePath("/admin/tours");
    revalidatePath(`/admin/tours/${id}`);
    redirect("/admin/tours");
  }

  return (
    <div className="max-w-3xl space-y-8">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/tours"
          className="p-2 bg-brand-gray border border-brand-gray-light rounded hover:text-brand-orange transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-heading text-brand-white uppercase mb-1">
            Editar Tour
          </h1>
          <p className="text-brand-gray-text">A editar: {tour.name}</p>
        </div>
      </div>

      <div className="bg-brand-gray border border-brand-gray-light rounded-lg p-6">
        <form action={updateTour} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-brand-gray-text mb-2">
                Nome
              </label>
              <input
                type="text"
                name="name"
                defaultValue={tour.name}
                required
                className="w-full px-4 py-3 bg-brand-gray-light border border-brand-gray-light rounded text-brand-white focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-gray-text mb-2">
                Duração (texto)
              </label>
              <input
                type="text"
                name="duration"
                defaultValue={tour.duration}
                required
                className="w-full px-4 py-3 bg-brand-gray-light border border-brand-gray-light rounded text-brand-white focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-gray-text mb-2">
                Preço 2 Lugares (€)
              </label>
              <input
                type="number"
                step="0.01"
                name="price_2_seater"
                defaultValue={tour.price_2_seater}
                required
                className="w-full px-4 py-3 bg-brand-gray-light border border-brand-gray-light rounded text-brand-white focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-gray-text mb-2">
                Preço 4 Lugares (€)
              </label>
              <input
                type="number"
                step="0.01"
                name="price_4_seater"
                defaultValue={tour.price_4_seater}
                required
                className="w-full px-4 py-3 bg-brand-gray-light border border-brand-gray-light rounded text-brand-white focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none"
              />
            </div>

            <div className="flex items-center gap-3 mt-4">
              <input
                type="checkbox"
                id="is_active"
                name="is_active"
                defaultChecked={tour.is_active}
                className="w-5 h-5 accent-brand-orange"
              />
              <label htmlFor="is_active" className="text-sm font-medium text-brand-white">
                Tour Ativo (visível no site)
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-brand-gray-light flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 bg-brand-orange hover:bg-brand-orange-light text-brand-white font-bold py-3 px-6 rounded transition-colors"
            >
              <Save className="w-5 h-5" />
              Guardar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
