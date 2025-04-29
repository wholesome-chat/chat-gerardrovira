import md5 from "md5";

export default function Avatar({ email }: { email: void | string }) {
  if (email == null) {
    return <div className="w-10 h-10 bg-gray-600 rounded-full"></div>;
  }
  return (
    <img
      src={
        email
          ? `https://www.gravatar.com/avatar/${md5(
              email.trim().toLowerCase()
            )}?d=404`
          : ""
      }
      onError={(e) => {
        (e.target as HTMLImageElement).src = "";
        (e.target as HTMLImageElement).style.display = "none";
      }}
      alt="User Avatar"
      className="w-10 h-10 bg-gray-600 rounded-full"
    />
  );
}
