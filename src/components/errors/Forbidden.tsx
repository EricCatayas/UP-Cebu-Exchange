export default function Forbidden({
  header = 'Access Denied',
  subheader,
  linkText,
  linkHref,
}: {
  header?: string;
  subheader?: string;
  linkText: string;
  linkHref: string;
}) {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <div className="px-8 py-6 w-full max-w-md">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-800 font-medium">{header}</p>
          {subheader && <p className="text-red-800 mt-2">{subheader}</p>}
          <a href={linkHref} className="text-blue-600 hover:underline mt-4 inline-block">
            {linkText}
          </a>
        </div>
      </div>
    </div>
  );
}
