"use client";

import { useEffect, useState } from "react";

import Image from "next/image";

import { supabase } from "@/lib/supabase";

import { toast } from "sonner";

import { useTranslation } from "@/hooks/useTranslation";

type Employee = {
  id: number;
  full_name: string;
  pin_code: string;
  site_id: number;
  photo_url?: string;
};

type Props = {
  open: boolean;

  onClose: () => void;

  employee: Employee | null;

  onUpdated: () => void;
};

export function EditEmployeeDialog({
  open,
  onClose,
  employee,
  onUpdated,
}: Props) {

  const { t } = useTranslation();

  const [fullName, setFullName] =
    useState("");

  const [pinCode, setPinCode] =
    useState("");

  const [siteId, setSiteId] =
    useState("1");

  const [photoUrl, setPhotoUrl] =
    useState("");

  const [photoFile, setPhotoFile] =
    useState<File | null>(null);

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {

    if (!employee) {
      return;
    }

    setFullName(
      employee.full_name
    );

    setPinCode(
      employee.pin_code
    );

    setSiteId(
      String(employee.site_id)
    );

    setPhotoUrl(
      employee.photo_url || ""
    );

  }, [employee]);

  const handleSave = async () => {

    if (!employee) {
      return;
    }

    setLoading(true);

    let uploadedPhotoUrl =
      photoUrl;

    if (photoFile) {

      const fileExt =
        photoFile.name
          .split(".")
          .pop();

      const fileName =
        `${Date.now()}.${fileExt}`;

      const {
        error: uploadError,
      } = await supabase
        .storage
        .from("employee-photos")
        .upload(
          fileName,
          photoFile
        );

      if (uploadError) {

        console.error(uploadError);

        toast.error(
          t.photoUploadError
        );

        setLoading(false);

        return;
      }

      const {
        data: publicUrlData,
      } = supabase
        .storage
        .from("employee-photos")
        .getPublicUrl(fileName);

      uploadedPhotoUrl =
        publicUrlData.publicUrl;
    }

    const { error } =
      await supabase
        .from("employees")
        .update({
          full_name:
            fullName,

          pin_code:
            pinCode,

          site_id:
            Number(siteId),

          photo_url:
            uploadedPhotoUrl,
        })
        .eq(
          "id",
          employee.id
        );

    setLoading(false);

    if (error) {

      console.error(error);

      toast.error(
        t.saveError
      );

      return;
    }

    toast.success(
      t.employeeUpdated
    );

    onUpdated();

    onClose();
  };

  if (!open || !employee) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">

      <div className="bg-white rounded-2xl p-6 w-full max-w-md space-y-5 max-h-[90vh] overflow-y-auto">

        <h2 className="text-2xl font-bold">

          {t.editEmployee}

        </h2>

        <div className="flex justify-center">

          <div className="w-[120px] h-[160px] rounded-2xl overflow-hidden bg-gray-100 border">

            {photoUrl ? (

              <Image
                src={photoUrl}
                alt={fullName}
                width={120}
                height={160}
                className="w-full h-full object-cover"
              />

            ) : (

              <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-gray-400">

                {fullName?.[0]}

              </div>

            )}

          </div>

        </div>

        <div className="space-y-2">

          <label className="text-sm font-medium">

            {t.replacePhoto}

          </label>

          <div className="space-y-3">

            <label
              htmlFor="photo-upload"
              className="h-11 px-4 rounded-xl border flex items-center justify-center cursor-pointer hover:bg-gray-50 transition text-sm font-medium"
            >

              📷 {t.uploadPhoto}

            </label>

            <input
              id="photo-upload"
              type="file"
              accept="image/*"
              onChange={(e) => {

                const file =
                  e.target.files?.[0];

                if (!file) {
                  return;
                }

                setPhotoFile(file);

                const previewUrl =
                  URL.createObjectURL(file);

                setPhotoUrl(previewUrl);
              }}
              className="hidden"
            />

            {photoFile && (

              <div className="text-sm text-gray-500 break-all">

                {photoFile.name}

              </div>

            )}

          </div>

        </div>

        <div className="space-y-2">

          <label className="text-sm font-medium">

            {t.fullName}

          </label>

          <input
            value={fullName}
            onChange={(e) =>
              setFullName(
                e.target.value
              )
            }
            className="w-full h-11 rounded-xl border px-4"
          />

        </div>

        <div className="space-y-2">

          <label className="text-sm font-medium">

            {t.pinCode}

          </label>

          <input
            value={pinCode}
            onChange={(e) =>
              setPinCode(
                e.target.value
              )
            }
            className="w-full h-11 rounded-xl border px-4"
          />

        </div>

        <div className="space-y-2">

          <label className="text-sm font-medium">

            {t.site}

          </label>

          <select
            value={siteId}
            onChange={(e) =>
              setSiteId(
                e.target.value
              )
            }
            className="w-full h-11 rounded-xl border px-4"
          >

            <option value="1">
              {t.argo}
            </option>

            <option value="2">
              {t.bukovaya}
            </option>

          </select>

        </div>

        <div className="flex gap-3 pt-2">

          <button
            onClick={onClose}
            className="flex-1 h-11 rounded-xl border"
          >

            {t.cancel}

          </button>

          <button
            onClick={handleSave}
            disabled={loading}
            className="flex-1 h-11 rounded-xl bg-blue-600 text-white font-medium"
          >

            {loading
              ? t.saving
              : t.save}

          </button>

        </div>

      </div>

    </div>
  );
}