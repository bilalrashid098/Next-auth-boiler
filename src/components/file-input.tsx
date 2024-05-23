import toast from "react-hot-toast";
import { CldUploadWidget } from "next-cloudinary";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function FileInput(props: any) {
  const { setValue, isReset, setIsReset } = props;
  const [resource, setResource] = useState({}) as any;

  useEffect(() => {
    if (isReset) {
      setResource(null);
      setIsReset(false);
    }
  }, [isReset]);

  useEffect(() => {
    return () => {
      setResource(null);
    };
  }, []);

  return (
    <div>
      <CldUploadWidget
        uploadPreset="next_app"
        onSuccess={(result: any, { widget }) => {
          setResource(result?.info); // { public_id, secure_url, etc }
          setValue("file", result?.info?.url);
          widget.close();
        }}
        onQueuesStart={(results: any, options: any) => {
          console.log(results, options);
        }}
      >
        {({ open }) => {
          function handleOnClick() {
            setResource(null);
            open();
          }
          return (
            <>
              {resource ? (
                <div className="previewContainer">
                  <Image
                    src={resource?.thumbnail_url}
                    alt={resource?.original_filename || ""}
                    width={100}
                    height={170}
                  />
                  <div className="cross" onClick={() => setResource(null)}>
                    x
                  </div>
                </div>
              ) : (
                <div
                  className="w-full text-white bg-gray-400 hover:bg-gray-500 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                  onClick={handleOnClick}
                >
                  Upload Paper
                </div>
              )}
            </>
          );
        }}
      </CldUploadWidget>
    </div>
  );
}
