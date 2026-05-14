type AdminStatsProps = {
  title: string;
  value: number;
};

export function AdminStats({
  title,
  value,
}: AdminStatsProps) {

  return (
    <div className="bg-white rounded-2xl p-5 shadow-xl">

      <p className="text-sm text-gray-500">
        {title}
      </p>

      <h2 className="text-3xl font-bold text-gray-900 mt-2">
        {value}
      </h2>

    </div>
  );
}