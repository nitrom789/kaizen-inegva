type EmployeeAvatarProps = {
  photoUrl?: string | null;
  fullName?: string;
  width?: number;
  height?: number;
};

export function EmployeeAvatar({
  photoUrl,
  fullName = "",
  width = 72,
  height = 96,
}: EmployeeAvatarProps) {

  const initials =
    fullName
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  if (photoUrl) {

    return (
      <img
        src={photoUrl}
        alt={fullName}
        style={{
          width,
          height,
        }}
        className="
          rounded-2xl
          object-cover
          border
          border-white/40
          shadow-lg
          bg-white
        "
      />
    );
  }

  return (
    <div
      style={{
        width,
        height,
      }}
      className="
        rounded-2xl
        bg-gradient-to-br
        from-blue-500
        to-blue-700
        text-white
        flex
        items-center
        justify-center
        font-bold
        text-2xl
        shadow-lg
        border
        border-white/40
      "
    >

      {initials || "?"}

    </div>
  );
}