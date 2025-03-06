'use client';

import { Github, Mail, LinkedinIcon } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="flex items-center space-x-6">
            <Link
              href="https://github.com/abdelhossam"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors duration-200 flex items-center gap-2"
            >
              <Github className="h-5 w-5" />
              <span>GitHub</span>
            </Link>
            <Link
              href="https://www.linkedin.com/in/abdelhossam/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors duration-200 flex items-center gap-2"
            >
              <LinkedinIcon className="h-5 w-5" />
              <span>LinkedIn</span>
            </Link>
            <Link
              href="mailto:abdel.hossam.m@gmail.com"
              className="text-gray-600 hover:text-gray-900 transition-colors duration-200 flex items-center gap-2"
            >
              <Mail className="h-5 w-5" />
              <span>abdel.hossam.m@gmail.com</span>
            </Link>
          </div>
          
          <div className="text-sm text-gray-500 text-center">

          </div>
        </div>
      </div>
    </footer>
  );
}