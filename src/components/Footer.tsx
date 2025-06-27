
import React from 'react';
import { Instagram, Linkedin, Github, Youtube, Camera } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const Footer = () => {
  const socialLinks = [
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/suraj_nate/?igsh=ajB6OHpwZWpicXhl#',
      icon: Instagram,
      color: 'hover:text-pink-500'
    },
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/suraj-nate-50001a27b/',
      icon: Linkedin,
      color: 'hover:text-blue-600'
    },
    {
      name: 'GitHub',
      url: 'https://github.com/SurajNate',
      icon: Github,
      color: 'hover:text-gray-800'
    },
    {
      name: 'YouTube',
      url: 'https://www.youtube.com/@suraj_nate',
      icon: Youtube,
      color: 'hover:text-red-600'
    },
    {
      name: 'Pexel Photography',
      url: 'https://www.pexels.com/@suraj-nate-2153301455/',
      icon: Camera,
      color: 'hover:text-green-600'
    }
  ];

  return (
    <footer className="bg-white border-t mt-12">
      <div className="container mx-auto px-4 py-8">
        {/* Social Media Icons */}
        <div className="flex justify-center items-center gap-6 mb-6">
          {socialLinks.map((link) => {
            const IconComponent = link.icon;
            return (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-3 rounded-full bg-gray-50 text-gray-600 transition-all duration-300 ${link.color} hover:bg-gray-100 hover:scale-110`}
                aria-label={link.name}
              >
                <IconComponent className="h-5 w-5" />
              </a>
            );
          })}
        </div>

        {/* Horizontal Separator */}
        <div className="flex justify-center mb-6">
          <Separator className="w-1/2 max-w-md" />
        </div>

        {/* Copyright */}
        <div className="text-center">
          <p className="text-gray-600 text-sm">
            © 2025 Suraj Nate. All rights reserved.
            <p>AI/ML | Data Science Engineer</p>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
