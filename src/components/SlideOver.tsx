import { Icon } from "./Icon";

interface SlideOverProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}

export const SlideOver = ({
  isOpen,
  onClose,
  children,
  title,
}: SlideOverProps) => {
  return (
    <div
      className={`relative z-50 ${
        isOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      <div
        className={`fixed inset-0 bg-gray-900 bg-opacity-50 transition-opacity ${
          isOpen ? "opacity-50" : "opacity-0"
        }`}
      />

      <div className="fixed inset-0 right-0 overflow-hidden">
        <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
          <div
            className={`max-w-md transform transition ease-in-out duration-300 ${
              isOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
              <div className="bg-green-950 px-4 py-6 sm:px-6">
                <div className="flex items-center justify-between">
                  <h2
                    className="text-base font-semibold leading-6 text-white"
                    id="slide-over-title"
                  >
                    {title}
                  </h2>
                  <div className="ml-3 flex h-7 items-center">
                    <button
                      type="button"
                      className="relative rounded-md bg-green-950 text-white focus:outline-none"
                      onClick={onClose}
                    >
                      <Icon id="cancel" size={24} />
                    </button>
                  </div>
                </div>
              </div>
              <div className="relative flex-1 px-4 sm:px-6 mt-6">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
