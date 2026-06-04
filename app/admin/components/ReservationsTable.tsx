"use client";

import { useState } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
} from "@tanstack/react-table";
import { formatPrice } from "@/lib/utils";
import { Check, X, ChevronDown, ChevronUp } from "lucide-react";
import { updateReservationStatus } from "./actions";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type Reservation = {
  id: string;
  booking_ref: string;
  customer_name: string;
  customer_email: string;
  tour_id: string;
  slot_date: string;
  slot_time: string;
  number_of_buggies: number;
  total_price: number;
  status: string;
  payment_method: string;
};

const columnHelper = createColumnHelper<Reservation>();

export function ReservationsTable({ data }: { data: Reservation[] }) {
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleStatusChange = async (id: string, newStatus: string) => {
    setLoadingId(id);
    try {
      await updateReservationStatus(id, newStatus);
      toast.success(`Reserva ${newStatus === 'confirmado' ? 'confirmada' : 'cancelada'} com sucesso.`);
      router.refresh();
    } catch (error) {
      toast.error("Erro ao atualizar a reserva.");
    } finally {
      setLoadingId(null);
    }
  };

  const columns = [
    columnHelper.accessor("booking_ref", {
      header: "Ref.",
      cell: (info) => <span className="font-mono text-xs">{info.getValue()}</span>,
    }),
    columnHelper.accessor("customer_name", {
      header: "Cliente",
      cell: (info) => (
        <div>
          <div className="font-medium text-brand-white">{info.getValue()}</div>
          <div className="text-xs text-brand-gray-text">{info.row.original.customer_email}</div>
        </div>
      ),
    }),
    columnHelper.accessor("slot_date", {
      header: "Data/Hora",
      cell: (info) => (
        <div>
          <div className="text-brand-white">{info.getValue()}</div>
          <div className="text-xs text-brand-gray-text">{info.row.original.slot_time}</div>
        </div>
      ),
    }),
    columnHelper.accessor("number_of_buggies", {
      header: "Buggies",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("total_price", {
      header: "Total",
      cell: (info) => formatPrice(info.getValue()),
    }),
    columnHelper.accessor("status", {
      header: "Estado",
      cell: (info) => {
        const status = info.getValue();
        return (
          <span
            className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
              status === "confirmado"
                ? "bg-green-500/10 text-green-500"
                : status === "pendente" || status === "pendente_mbway"
                ? "bg-yellow-500/10 text-yellow-500"
                : status === "concluido"
                ? "bg-blue-500/10 text-blue-500"
                : "bg-red-500/10 text-red-500"
            }`}
          >
            {status === "confirmado" && "Confirmada"}
            {status === "pendente" && "Pendente (Local)"}
            {status === "pendente_mbway" && "Pendente (MBWay)"}
            {status === "concluido" && "Concluída"}
            {status === "cancelado" && "Cancelada"}
          </span>
        );
      },
    }),
    columnHelper.display({
      id: "actions",
      header: "Ações",
      cell: (info) => {
        const status = info.row.original.status;
        const id = info.row.original.id;
        const isPending = status === "pendente" || status === "pendente_mbway";
        const isActionable = status !== "cancelado" && status !== "concluido";

        if (!isActionable) return null;

        return (
          <div className="flex items-center gap-2">
            {isPending && (
              <button
                onClick={() => handleStatusChange(id, "confirmado")}
                disabled={loadingId === id}
                className="p-1.5 bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white rounded transition-colors disabled:opacity-50"
                title="Confirmar"
              >
                <Check className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => handleStatusChange(id, "cancelado")}
              disabled={loadingId === id}
              className="p-1.5 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded transition-colors disabled:opacity-50"
              title="Cancelar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      },
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="bg-brand-gray border border-brand-gray-light rounded-lg overflow-hidden flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="bg-brand-gray-light border-b border-brand-gray-light">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="p-4 text-sm font-medium text-brand-gray-text cursor-pointer hover:text-brand-white select-none"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center gap-2">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {{
                        asc: <ChevronUp className="w-3 h-3" />,
                        desc: <ChevronDown className="w-3 h-3" />,
                      }[header.column.getIsSorted() as string] ?? null}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-b border-brand-gray-light last:border-0 hover:bg-brand-gray-light/50 transition-colors">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="p-4">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="p-8 text-center text-brand-gray-text">
                  Nenhuma reserva encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="p-4 border-t border-brand-gray-light flex items-center justify-between">
        <div className="text-sm text-brand-gray-text">
          Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount() || 1}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1 bg-brand-gray-light rounded text-sm disabled:opacity-50"
          >
            Anterior
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1 bg-brand-gray-light rounded text-sm disabled:opacity-50"
          >
            Próxima
          </button>
        </div>
      </div>
    </div>
  );
}
