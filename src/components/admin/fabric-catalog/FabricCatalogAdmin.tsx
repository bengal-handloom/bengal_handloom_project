"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Group,
  Modal,
  NumberInput,
  Select,
  Stack,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import type { FabricCatalogInput, FabricCatalogItem } from "@/types/fabricCatalog";
import { s3KeyToPublicUrl } from "@/lib/s3";
import FormFields from "./FabricFormFields";

const EMPTY: FabricCatalogInput = {
  imageLargeUrl: "",
  imageSmallUrl: "",
  name: "",
  location: "",
  pricePerMeter: 0,
  weightPercent: 0,
  softnessPercent: 0,
  gsm: "",
  artisanKey: "",
  region: "",
  availableMeters: 0,
  subHeader: "",
  description: "",
  collectionType: "",
};

type ListResponse = {
  fabrics?: FabricCatalogItem[];
  total?: number;
  page?: number;
  pageSize?: number;
  totalPages?: number;
  error?: string;
};

type PageSizeMode = "20" | "50" | "all";

const modalClassNames = {
  content: "bg-[#121212] border border-[#2f2f2f]",
  header: "bg-[#121212] border-b border-[#2f2f2f]",
  title: "text-[#c5a059] font-semibold",
  body: "text-[#bdb29e]",
};

function itemToInput(item: FabricCatalogItem): FabricCatalogInput {
  return {
    imageLargeUrl: item.imageLargeUrl,
    imageSmallUrl: item.imageSmallUrl,
    name: item.name,
    location: item.location,
    pricePerMeter: item.pricePerMeter,
    weightPercent: item.weightPercent,
    softnessPercent: item.softnessPercent,
    gsm: item.gsm,
    artisanKey: item.artisanKey ?? null,

    region: item.region,
    availableMeters: item.availableMeters,
    subHeader: item.subHeader,
    description: item.description,
    collectionType: item.collectionType,
  };
}

export function FabricCatalogAdmin() {
  const router = useRouter();

  const [fabrics, setFabrics] = useState<FabricCatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [pageSizeMode, setPageSizeMode] = useState<PageSizeMode>("20");
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [viewItem, setViewItem] = useState<FabricCatalogItem | null>(null);
  const [editItem, setEditItem] = useState<FabricCatalogItem | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<FabricCatalogItem | null>(null);
  const [form, setForm] = useState<FabricCatalogInput>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [importingCsv, setImportingCsv] = useState(false);
  const [exportingCsv, setExportingCsv] = useState(false);
  async function handleExportCsv() {
    setExportingCsv(true);
    try {
      const res = await fetch("/api/admin/fabrics/export-csv", {
        method: "GET",
        cache: "no-store",
      });

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          router.replace("/admin/login");
          return;
        }
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { error?: string }).error || "Export failed");
      }

      const blob = await res.blob();
      const cd = res.headers.get("Content-Disposition");
      const match = cd?.match(/filename="([^"]+)"/);
      const filename = match?.[1] ?? "fabrics-export.csv";

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);

      notifications.show({
        title: "Export started",
        message: "Your CSV download should begin shortly.",
        color: "green",
      });
    } catch (err) {
      notifications.show({
        title: "Error",
        message: err instanceof Error ? err.message : "Export failed",
        color: "red",
      });
    } finally {
      setExportingCsv(false);
    }
  }


  async function handleCsvFile(file: File | undefined) {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".csv")) {
      notifications.show({
        title: "Error",
        message: "Please choose a .csv file.",
        color: "red",
      });
      return;
    }

    setImportingCsv(true);
    try {
      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch("/api/admin/fabrics/import-csv", {
        method: "POST",
        body: fd,
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          router.replace("/admin/login");
          return;
        }
        throw new Error((data as { error?: string }).error || "CSV import failed");
      }

      const d = data as { created?: number; updated?: number; totalRows?: number };
      notifications.show({
        title: "Import complete",
        message: `Rows: ${d.totalRows ?? "—"} · Created: ${d.created ?? 0} · Updated: ${d.updated ?? 0}`,
        color: "green",
      });

      await load(true);
    } catch (err) {
      notifications.show({
        title: "Error",
        message: err instanceof Error ? err.message : "CSV import failed",
        color: "red",
      });
    } finally {
      setImportingCsv(false);
    }
  }


  const load = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);

      try {
        const qs = new URLSearchParams({
          page: String(page),
          pageSize: pageSizeMode,
        });
        const res = await fetch(`/api/admin/fabrics?${qs.toString()}`, {
          method: "GET",
          cache: "no-store",
        });
        const data: ListResponse = await res.json().catch(() => ({}));

        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
            router.replace("/admin/login");
            return;
          }
          throw new Error(data.error || "Failed to load fabrics");
        }

        const rawFabrics = Array.isArray(data.fabrics) ? data.fabrics : [];

        const keys: string[] = [];
        for (const f of rawFabrics) {
          if (f.imageSmallUrl) keys.push(f.imageSmallUrl);
          if (f.imageLargeUrl) keys.push(f.imageLargeUrl);
        }

        const signedMap = await fetchSignedUrls(keys);

        const withSigned = rawFabrics.map((f) => ({
          ...f,
          imageSmallUrl: f.imageSmallUrl ? signedMap[f.imageSmallUrl] || s3KeyToPublicUrl(f.imageSmallUrl) : "",
          imageLargeUrl: f.imageLargeUrl ? signedMap[f.imageLargeUrl] || s3KeyToPublicUrl(f.imageLargeUrl) : "",
        }));

        setFabrics(withSigned);

        setTotal(typeof data.total === "number" ? data.total : 0);
        setTotalPages(typeof data.totalPages === "number" ? data.totalPages : 1);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load fabrics");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [page, pageSizeMode, router]
  );

  useEffect(() => {
    void load(false);
  }, [load]);

  function openAdd() {
    setForm(EMPTY);
    setAddOpen(true);
  }

  function openEdit(item: FabricCatalogItem) {
    setForm(itemToInput(item));
    setEditItem(item);
  }

  async function submitCreate() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/fabrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          router.replace("/admin/login");
          return;
        }
        throw new Error((data as { error?: string }).error || "Create failed");
      }
      notifications.show({
        title: "Success",
        message: "Fabric added successfully.",
        color: "green",
      });
      setAddOpen(false);
      setForm(EMPTY);
      await load(true);
    } catch (err: unknown) {
      notifications.show({
        title: "Error",
        message: err instanceof Error ? err.message : "Create failed",
        color: "red",
      });
    } finally {
      setSaving(false);
    }
  }

  async function submitEdit() {
    if (!editItem) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/fabrics/${editItem.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          router.replace("/admin/login");
          return;
        }
        throw new Error((data as { error?: string }).error || "Update failed");
      }
      notifications.show({
        title: "Success",
        message: "Fabric updated successfully.",
        color: "green",
      });
      setEditItem(null);
      await load(true);
    } catch (err: unknown) {
      notifications.show({
        title: "Error",
        message: err instanceof Error ? err.message : "Update failed",
        color: "red",
      });
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!deleteItem) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/fabrics/${deleteItem.id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          router.replace("/admin/login");
          return;
        }
        throw new Error((data as { error?: string }).error || "Delete failed");
      }
      notifications.show({
        title: "Success",
        message: "Fabric deleted successfully.",
        color: "green",
      });
      setDeleteItem(null);
      await load(true);
    } catch (err: unknown) {
      notifications.show({
        title: "Error",
        message: err instanceof Error ? err.message : "Delete failed",
        color: "red",
      });
    } finally {
      setDeleting(false);
    }
  }

  async function fetchSignedUrls(keys: string[]): Promise<Record<string, string>> {
    const unique = [...new Set(keys.map((k) => k.trim()).filter(Boolean))];
    if (unique.length === 0) return {};
  
    const res = await fetch("/api/admin/fabrics/signed-urls", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ keys: unique, expiresInSec: 600 }),
    });
  
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error((data as { error?: string }).error || "Failed to fetch signed URLs");
    }
    return (data as { urls?: Record<string, string> }).urls || {};
  }



  if (loading) {
    return (
      <section>
        <p className="text-sm text-[#9d9589]">Loading fabrics...</p>
      </section>
    );
  }

  return (
    <section>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#c5a059]">Fabric catalog</h1>
          <p className="mt-1 text-sm text-[#9d9589]">
            Total fabrics: <span className="text-[#d7c08b]">{total}</span>
          </p>
        </div>
        <Group gap="sm">
          <Button
            variant="light"
            color="gray"
            loading={exportingCsv}
            onClick={() => void handleExportCsv()}
            className="border border-[#3a3a3a] bg-[#171717] text-[#d6cec1]"
          >
            Export CSV
          </Button>
          <Button
            component="label"
            variant="light"
            color="gray"
            loading={importingCsv}
            className="border border-[#3a3a3a] bg-[#171717] text-[#d6cec1] cursor-pointer"
          >
            Import CSV
            <input
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              disabled={importingCsv}
              onChange={(e) => {
                const f = e.currentTarget.files?.[0];
                void handleCsvFile(f);
                e.currentTarget.value = "";
              }}
            />
          </Button>
          <Button
            variant="light"
            color="gray"
            onClick={() => void load(true)}
            loading={refreshing}
            className="border border-[#3a3a3a] bg-[#171717] text-[#d6cec1]"
          >
            Refresh
          </Button>
          <Button
            onClick={openAdd}
            classNames={{ root: "bg-[#c5a059] text-black hover:opacity-90" }}
          >
            Add item
          </Button>
        </Group>
      </div>

      {error ? (
        <div className="mb-4 rounded-md border border-red-900/50 bg-red-950/30 px-3 py-2 text-sm text-red-300">
          {error}
        </div>
      ) : null}

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Text size="sm" className="text-[#9d9589]">
          Rows per page
        </Text>
        <Select
          size="sm"
          value={pageSizeMode}
          onChange={(v) => {
            const next = (v as PageSizeMode) || "20";
            setPageSizeMode(next);
            setPage(1);
          }}
          data={[
            { value: "20", label: "20" },
            { value: "50", label: "50" },
            { value: "all", label: "All" },
          ]}
          classNames={{ input: "bg-[#171717] border-[#3a3a3a] w-[120px]" }}
        />
      </div>

      {fabrics.length === 0 ? (
        <div className="rounded-xl border border-[#2f2f2f] bg-[#121212] p-6 text-sm text-[#9d9589]">
          No fabrics yet. Use &quot;Add item&quot; to create one.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[#2f2f2f] bg-[#121212]">
          <table className="min-w-full text-sm">
            <thead className="bg-[#171717] text-left text-[#d7c08b]">
              <tr>
                <th className="px-3 py-3 w-16"> </th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Price / m</th>
                <th className="px-4 py-3">Region</th>
                <th className="px-4 py-3">GSM</th>
                <th className="px-4 py-3">Available m</th>
                <th className="px-4 py-3">Collection</th>
                <th className="px-4 py-3 w-36">Actions</th>
              </tr>
            </thead>
            <tbody>
              {fabrics.map((row) => (
                <tr key={row.id} className="border-t border-[#262626] align-middle">
                  <td className="px-3 py-2">
                    {row.imageSmallUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={row.imageSmallUrl}
                        alt=""
                        className="h-10 w-10 rounded object-cover border border-[#333]"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded border border-[#333] bg-[#1a1a1a]">
                        <span className="material-symbols-outlined text-[#555] text-xl">image</span>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-[#e2dacd]">{row.name || "—"}</div>
                    {row.subHeader ? (
                      <div className="text-xs text-[#928b80]">{row.subHeader}</div>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 text-[#bdb29e]">{row.location || "—"}</td>
                  <td className="px-4 py-3 text-[#bdb29e]">{row.pricePerMeter}</td>
                  <td className="px-4 py-3 text-[#bdb29e]">{row.region || "—"}</td>
                  <td className="px-4 py-3 text-[#bdb29e]">{row.gsm || "—"}</td>
                  <td className="px-4 py-3 text-[#bdb29e]">{row.availableMeters}</td>
                  <td className="px-4 py-3 text-[#bdb29e]">{row.collectionType || "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        title="View"
                        onClick={() => setViewItem(row)}
                        className="rounded-md p-2 text-[#c5a059] hover:bg-[#1f1f1f]"
                      >
                        <span className="material-symbols-outlined text-xl">visibility</span>
                      </button>
                      <button
                        type="button"
                        title="Edit"
                        onClick={() => openEdit(row)}
                        className="rounded-md p-2 text-[#9d9589] hover:bg-[#1f1f1f]"
                      >
                        <span className="material-symbols-outlined text-xl">edit</span>
                      </button>
                      <button
                        type="button"
                        title="Delete"
                        onClick={() => setDeleteItem(row)}
                        className="rounded-md p-2 text-red-400/90 hover:bg-[#1f1f1f]"
                      >
                        <span className="material-symbols-outlined text-xl">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pageSizeMode !== "all" && totalPages > 1 ? (
        <div className="mt-4 flex items-center justify-center gap-3">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="rounded-md border border-[#3a3a3a] bg-[#171717] px-3 py-1.5 text-sm disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-sm text-[#9d9589]">
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="rounded-md border border-[#3a3a3a] bg-[#171717] px-3 py-1.5 text-sm disabled:opacity-40"
          >
            Next
          </button>
        </div>
      ) : null}

      {/* View */}
      <Modal
        opened={!!viewItem}
        onClose={() => setViewItem(null)}
        title="Fabric details"
        size="lg"
        centered
        classNames={modalClassNames}
        overlayProps={{ opacity: 0.65, blur: 4 }}
      >
        {viewItem ? (
          <Stack gap="xs">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <Text size="xs" c="dimmed">
                  Large image
                </Text>
                {viewItem.imageLargeUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={viewItem.imageLargeUrl}
                    alt=""
                    className="mt-1 max-h-48 w-full rounded object-contain bg-black/30"
                  />
                ) : (
                  <Text size="sm">—</Text>
                )}
              </div>
              <div>
                <Text size="xs" c="dimmed">
                  Small image
                </Text>
                {viewItem.imageSmallUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={viewItem.imageSmallUrl}
                    alt=""
                    className="mt-1 h-32 w-32 rounded object-cover bg-black/30"
                  />
                ) : (
                  <Text size="sm">—</Text>
                )}
              </div>
            </div>
            <DetailRow label="Name" value={viewItem.name} />
            <DetailRow label="Sub header" value={viewItem.subHeader} />
            <DetailRow label="Location" value={viewItem.location} />
            <DetailRow label="Region" value={viewItem.region} />
            <DetailRow label="Price per meter" value={String(viewItem.pricePerMeter)} />
            <DetailRow label="Weight %" value={String(viewItem.weightPercent)} />
            <DetailRow label="Softness %" value={String(viewItem.softnessPercent)} />
            <DetailRow label="GSM" value={viewItem.gsm} />
            <DetailRow label="Available meters" value={String(viewItem.availableMeters)} />
            <DetailRow label="Collection type" value={viewItem.collectionType} />
            <div>
              <Text size="xs" c="dimmed">
                Description
              </Text>
              <Text size="sm" className="whitespace-pre-wrap">
                {viewItem.description || "—"}
              </Text>
            </div>
          </Stack>
        ) : null}
      </Modal>

      {/* Add */}
      <Modal
        opened={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add fabric"
        size="lg"
        centered
        classNames={modalClassNames}
        overlayProps={{ opacity: 0.65, blur: 4 }}
      >
        <FormFields form={form} setForm={setForm} />
        <Group justify="flex-end" mt="md">
          <Button variant="subtle" color="gray" onClick={() => setAddOpen(false)}>
            Cancel
          </Button>
          <Button loading={saving} onClick={() => void submitCreate()} classNames={{ root: "bg-[#c5a059] text-black" }}>
            Save
          </Button>
        </Group>
      </Modal>

      {/* Edit */}
      <Modal
        opened={!!editItem}
        onClose={() => setEditItem(null)}
        title="Edit fabric"
        size="lg"
        centered
        classNames={modalClassNames}
        overlayProps={{ opacity: 0.65, blur: 4 }}
      >
        <FormFields form={form} setForm={setForm} />
        <Group justify="flex-end" mt="md">
          <Button variant="subtle" color="gray" onClick={() => setEditItem(null)}>
            Cancel
          </Button>
          <Button loading={saving} onClick={() => void submitEdit()} classNames={{ root: "bg-[#c5a059] text-black" }}>
            Save changes
          </Button>
        </Group>
      </Modal>

      {/* Delete confirm */}
      <Modal
        opened={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        title="Confirm delete"
        centered
        classNames={modalClassNames}
        overlayProps={{ opacity: 0.65, blur: 4 }}
      >
        <Text size="sm">Are you sure you want to delete this item?</Text>
        {deleteItem ? (
          <Text size="sm" mt="xs" className="text-[#d7c08b]">
            {deleteItem.name}
          </Text>
        ) : null}
        <Group justify="flex-end" mt="lg">
          <Button variant="subtle" color="gray" onClick={() => setDeleteItem(null)}>
            Cancel
          </Button>
          <Button color="red" loading={deleting} onClick={() => void confirmDelete()}>
            Delete
          </Button>
        </Group>
      </Modal>
    </section>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <Text size="xs" c="dimmed">
        {label}
      </Text>
      <Text size="sm">{value || "—"}</Text>
    </div>
  );
}
