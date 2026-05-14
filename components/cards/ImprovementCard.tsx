import Image from "next/image";

type ImprovementCardProps = {
  title: string;
  category: string;
  employee: string;
  description: string;
  photoUrl?: string;
  rejectReason?: string;
};

export function ImprovementCard({
  title,
  category,
  employee,
  description,
  photoUrl,
  rejectReason,
}: ImprovementCardProps) {

  return (
    <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100 space-y-4">

      <div className="flex items-start justify-between gap-2">

        <div className="flex items-center gap-3">

          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">

            {photoUrl ? (

              <Image
                src={photoUrl}
                alt={employee}
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />

            ) : (

              <div className="w-full h-full flex items-center justify-center text-sm font-semibold text-gray-600">

                {employee?.[0]}

              </div>

            )}

          </div>

          <div>

            <h3 className="font-semibold text-gray-900">
              {title}
            </h3>

            <p className="text-sm text-gray-500">
              {employee}
            </p>

          </div>

        </div>

        <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full whitespace-nowrap">
          {category}
        </span>

      </div>

      <p className="text-sm text-gray-700 leading-relaxed">
        {description}
      </p>
{rejectReason && (

  <div className="bg-red-50 border border-red-100 rounded-xl p-3">

    <p className="text-sm font-medium text-red-700">
      Причина отклонения
    </p>

    <p className="text-sm text-red-600 mt-1">
      {rejectReason}
    </p>

  </div>

)}
    </div>
  );
}