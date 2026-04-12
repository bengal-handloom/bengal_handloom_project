"use client";

import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
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
import { ARTISAN_KEYS } from "@/data/artisans";

export default function FormFields({ form, setForm }: { form: FabricCatalogInput, setForm: Dispatch<SetStateAction<FabricCatalogInput>> }) {
  const [uploadingLarge, setUploadingLarge] = useState(false);
  const [uploadingSmall, setUploadingSmall] = useState(false);
  const router = useRouter()

  async function uploadImage(file: File, imageKind: "large" | "small") {
    if (!form.name.trim()) {
      notifications.show({ title: "Error", message: "Enter Fabric Name before uploading image.", color: "red" });
      return;
    }

    const setLoading = imageKind === "large" ? setUploadingLarge : setUploadingSmall;
    setLoading(true);

    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("fabricName", form.name.trim());
      fd.append("imageKind", imageKind);

      const res = await fetch("/api/admin/fabrics/upload", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          router.replace("/admin/login");
          return;
        }
        throw new Error(data.error || "Upload failed");
      }

      const key = String(data.key || "");
      setForm((prev) =>
        imageKind === "large"
          ? { ...prev, imageLargeUrl: key }
          : { ...prev, imageSmallUrl: key }
      );

      notifications.show({ title: "Success", message: `${imageKind} image uploaded.`, color: "green" });
    } catch (err) {
      notifications.show({
        title: "Error",
        message: err instanceof Error ? err.message : "Upload failed",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Stack gap="sm">
      <TextInput
        label="Name"
        required
        value={form.name}
        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        classNames={{ input: "bg-[#171717] border-[#3a3a3a]" }}
      />
      <Group align="end" grow>
        <TextInput
          label="Large image key"
          value={form.imageLargeUrl}
          readOnly
          classNames={{ input: "bg-[#171717] border-[#3a3a3a]" }}
        />
        <Button component="label" loading={uploadingLarge}>
          Upload large image
          <input
            hidden
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={(e) => {
              const file = e.currentTarget.files?.[0];
              if (file) void uploadImage(file, "large");
              e.currentTarget.value = "";
            }}
          />
        </Button>
      </Group>

      <Group align="end" grow>
        <TextInput
          label="Small image key"
          value={form.imageSmallUrl}
          readOnly
          classNames={{ input: "bg-[#171717] border-[#3a3a3a]" }}
        />
        <Button component="label" loading={uploadingSmall}>
          Upload small image
          <input
            hidden
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={(e) => {
              const file = e.currentTarget.files?.[0];
              if (file) void uploadImage(file, "small");
              e.currentTarget.value = "";
            }}
          />
        </Button>
      </Group>
      <TextInput
        label="Location"
        value={form.location}
        onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
        classNames={{ input: "bg-[#171717] border-[#3a3a3a]" }}
      />
      <Group grow>
        <NumberInput
          label="Price per meter"
          min={0}
          decimalScale={2}
          value={form.pricePerYard}
          onChange={(v) => setForm((f) => ({ ...f, pricePerYard: typeof v === "number" ? v : 0 }))}
          classNames={{ input: "bg-[#171717] border-[#3a3a3a]" }}
        />
        <NumberInput
          label="Available yards"
          min={0}
          value={form.availableYards}
          onChange={(v) => setForm((f) => ({ ...f, availableYards: typeof v === "number" ? v : 0 }))}
          classNames={{ input: "bg-[#171717] border-[#3a3a3a]" }}
        />
      </Group>

      <Group grow>
        <TextInput
          label="GSM"
          value={form.gsm}
          onChange={(e) => setForm((f) => ({ ...f, gsm: e.target.value }))}
          classNames={{ input: "bg-[#171717] border-[#3a3a3a]" }}
        />
        <TextInput
          label="Region"
          value={form.region}
          onChange={(e) => setForm((f) => ({ ...f, region: e.target.value }))}
          classNames={{ input: "bg-[#171717] border-[#3a3a3a]" }}
        />
      </Group>
      <TextInput
        label="Sub header"
        value={form.subHeader}
        onChange={(e) => setForm((f) => ({ ...f, subHeader: e.target.value }))}
        classNames={{ input: "bg-[#171717] border-[#3a3a3a]" }}
      />
      <Select
        label="Artisan key"
        placeholder="Select an artisan (optional)"
        data={[
          { value: "", label: "None" },
          ...ARTISAN_KEYS.map((k) => ({ value: k, label: k })),
        ]}
        value={(form as any).artisanKey ?? ""} // until you update FabricCatalogInput typing everywhere
        onChange={(v) => setForm((f) => ({ ...(f as any), artisanKey: v || null }))}
        searchable
        clearable
        classNames={{ input: "bg-[#171717] border-[#3a3a3a]" }}
      />
      <TextInput
        label="Collection type"
        value={form.collectionType}
        onChange={(e) => setForm((f) => ({ ...f, collectionType: e.target.value }))}
        classNames={{ input: "bg-[#171717] border-[#3a3a3a]" }}
      />
      <Textarea
        label="Description"
        minRows={3}
        value={form.description}
        onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
        classNames={{ input: "bg-[#171717] border-[#3a3a3a]" }}
      />
    </Stack>
  );
}