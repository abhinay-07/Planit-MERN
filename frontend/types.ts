import React from 'react';

export interface NavItem {
  name: string;
  href: string;
}

export interface Feature {
  title: string;
  description: string;
  icon: React.ElementType;
}

export interface TopPick {
  name: string;
  imageUrl: string;
}

export interface Service {
    name: string;
    description: string;
    icon: React.ElementType;
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  imageUrl: string;
}