// components/ui/footer.tsx
import { Gamepad2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="pb-6 pt-16 lg:pb-8 lg:pt-36 w-full backdrop-blur-sm relative z-10">
      <div className="px-4 lg:px-8 max-w-6xl mx-auto">
        {/* Top Section: Branding & Social */}
        <div className="md:flex md:items-start md:justify-between">
          <a
            href="/"
            className="flex items-center gap-x-2 text-white group"
            aria-label="GameVault Home"
          >
            <Gamepad2 className="h-6 w-6 text-blue-500 fill-blue-500/10 group-hover:rotate-6 transition-transform" />
            <span className="font-bold text-xl tracking-tight">GameVault</span>
          </a>

          <ul className="flex list-none mt-6 md:mt-0 space-x-3">
            <li>
              <a
                href="https://github.com/andres-sr96"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Profile"
                className="h-10 w-10 flex items-center justify-center rounded-full bg-gray-900 border border-gray-800 hover:border-gray-700 hover:bg-gray-800/60 transition text-gray-300"
              >
                <svg
                  className="h-5 w-5 fill-current"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.008.069-.008 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </li>
          </ul>
        </div>

        {/* Bottom Section: Multi-Link Registry Grid */}
        <div className=" mt-6 pt-6 md:mt-4 md:pt-8 lg:grid lg:grid-cols-10 gap-4">
          {/* Main Navigation Row Links */}
          <nav className="lg:mt-0 lg:col-[4/11]">
            <ul className="list-none flex flex-wrap -my-1 -mx-2 lg:justify-end">
              {[
                { href: "/", label: "Home" },
                { href: "/games", label: "Browse" },
              ].map((link, i) => (
                <li key={i} className="my-1 mx-2 shrink-0">
                  <a
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-blue-400 transition underline-offset-4 hover:underline"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Legal Document Links */}
          <div className="mt-6 lg:mt-0 lg:col-[4/11]">
            <ul className="list-none flex flex-wrap -my-1 -mx-3 lg:justify-end">
              {[
                { href: "", label: "Privacy Policy" },
                { href: "", label: "Terms of Service" },
              ].map((link, i) => (
                <li key={i} className="my-1 mx-3 shrink-0">
                  <a
                    href={link.href}
                    className="text-sm text-gray-500 hover:text-gray-300 transition underline-offset-4 hover:underline"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Copyright & License Block */}
          <div className="mt-6 text-sm leading-6 text-gray-500 whitespace-nowrap lg:mt-0 lg:row-[1/3] lg:col-[1/4]">
            <div className="font-medium text-gray-400">
              © 2026 Andres Sanchez
            </div>
            <div className="text-xs text-gray-600 mt-0.5">
              Built for collectors & gamers.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
