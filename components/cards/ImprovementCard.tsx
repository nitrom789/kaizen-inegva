"use client";

import { EmployeeAvatar } from "@/components/ui/EmployeeAvatar";

import { useTranslation } from "@/hooks/useTranslation";

import { categoryTranslations } from "@/lib/categoryTranslations";

type ImprovementCardProps = {
  title: string;
  category: string;

  employeeRu: string;
  employeeUa: string;
  employeeEn: string;

  description: string;
  photoUrl?: string;
  rejectReason?: string;
};

export function ImprovementCard({
  title,
  category,

  employeeRu,
  employeeUa,
  employeeEn,

  description,
  photoUrl,
  rejectReason,
}: ImprovementCardProps) {

  const { language, t } =
    useTranslation();

  const employee =
  language === "ua"
    ? employeeUa
    : language === "en"
    ? employeeEn
    : employeeRu;

  const translatedCategory =
    categoryTranslations[
      language as keyof typeof categoryTranslations
    ]?.[
      category as keyof typeof categoryTranslations.ru
    ] || category;

  return (
    <div className="bg-white rounded-3xl p-5 shadow-xl border border-gray-100">

      <div className="flex gap-4">

        <EmployeeAvatar
          photoUrl={photoUrl}
          fullName={employee}
          width={72}
          height={96}
        />

        <div className="flex-1 space-y-3">

          <div className="flex items-start justify-between gap-3">

            <div>

              <h3 className="font-bold text-gray-900 text-lg leading-tight">

                {translatedCategory}

              </h3>

              <p className="text-sm text-gray-500 mt-1">

                {employee}

              </p>

            </div>

            <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full whitespace-nowrap h-fit">

              {translatedCategory}

            </span>

          </div>

          <p className="text-sm text-gray-700 leading-relaxed">

            {description}

          </p>

        </div>

      </div>

      {rejectReason && (

        <div className="mt-4 bg-red-50 border border-red-100 rounded-2xl p-4">

          <p className="text-sm font-semibold text-red-700">

            {t.rejectReason}

          </p>

          <p className="text-sm text-red-600 mt-1 leading-relaxed">

            {rejectReason}

          </p>

        </div>

      )}

    </div>
  );
}