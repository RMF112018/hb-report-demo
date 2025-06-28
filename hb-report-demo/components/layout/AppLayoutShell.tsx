"use client";

import React from "react";
import { AppHeader } from "@/components/layout/app-header";

interface AppLayoutShellProps {
  children: React.ReactNode;
  title?: React.ReactNode;
  actions?: React.ReactNode;
  nav?: React.ReactNode;
  showHeader?: boolean;
}

export function AppLayoutShell({
  children,
  title,
  actions,
  nav,
  showHeader = true,
}: AppLayoutShellProps) {
  return (
    <div className="flex flex-col w-full h-screen min-h-0 max-h-screen overflow-hidden">
      {showHeader && <div className="sticky top-0 z-50"><AppHeader /></div>}
      {(title || actions) && (
        <div className="sticky top-[56px] z-40 bg-white px-6 py-2 flex items-center justify-between gap-4">
          {title && (
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 leading-tight font-sans">
              {title}
            </h1>
          )}
          {actions && <div className="flex gap-2">{actions}</div>}
        </div>
      )}
      {nav && (
        <div className="sticky top-[104px] z-30 bg-white pt-2 pl-6 pb-1">
          {nav}
        </div>
      )}
      <main className="flex-1 min-h-0 overflow-y-auto w-full relative">{children}</main>
    </div>
  );
}
