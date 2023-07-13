import React, { useRef, useState, useEffect } from 'react';

type propsType = {
  parentElement: React.ReactNode;
  children: React.ReactNode;
};

const Popover = ({ parentElement, children }: propsType) => {
  const popoverRef = useRef<HTMLDivElement>(null);
  const [isPopover, setIsPopover] = useState(false);

  const handlePopover = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPopover(!isPopover);
  };

  const handleClose = (e: MouseEvent) => {
    if (
      popoverRef.current &&
      !popoverRef.current.contains(e.target as HTMLElement)
    ) {
      setIsPopover(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClose);

    return () => {
      document.removeEventListener('mousedown', handleClose);
    };
  }, []);

  return (
    <div className="relative" ref={popoverRef}>
      <div onClick={handlePopover}>{parentElement}</div>
      <div
        className={`absolute z-10 right-0 top-12 inline-block w-44 divide-y divide-gray-100 dark:divide-gray-600 text-sm text-gray-500 dark:text-gray-400 transition-opacity duration-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md shadow-light dark:shadow-none ${
          isPopover
            ? 'opacity-100 cursor-pointer pointer-events-auto'
            : 'opacity-0 cursor-none pointer-events-none'
        }`}
      >
        {children}
        <div className="w-3.5 h-3.5 bg-white dark:bg-gray-800 border-l border-t border-gray-200 dark:border-gray-600 absolute -top-2 right-2.5 rotate-45"></div>
      </div>
    </div>
  );
};

export default Popover;
