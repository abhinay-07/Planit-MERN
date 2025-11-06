import React from 'react';

const testimonials = [
  {
    quote:
      "Plan It's verified reviews are a game changer! I finally know which places are actually good and not just hyped up.",
    name: 'Anjali S.',
    role: 'VIT-AP Student',
    imageUrl: 'https://picsum.photos/seed/anjali/100/100',
  },
  {
    quote:
      'The trip planner is amazing. It estimated the cost and distance for our weekend getaway perfectly. Saved us so much time!',
    name: 'Rohan K.',
    role: 'Local Visitor',
    imageUrl: 'https://picsum.photos/seed/rohan/100/100',
  },
  {
    quote:
      'Renting a bike through the app was easy and affordable. The owner was verified, and the whole process was seamless.',
    name: 'Priya M.',
    role: 'VIT-AP Student',
    imageUrl: 'https://picsum.photos/seed/priya/100/100',
  },
];

const Testimonials = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            What Our Users Are Saying
          </h2>
        </div>
        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-white p-8 rounded-lg shadow-lg flex flex-col">
              <blockquote className="flex-grow">
                <p className="text-gray-600 text-lg">"{t.quote}"</p>
              </blockquote>
              <footer className="mt-6">
                <div className="flex items-center">
                  <img className="h-12 w-12 rounded-full" src={t.imageUrl} alt={t.name} />
                  <div className="ml-4">
                    <div className="text-base font-medium text-gray-900">{t.name}</div>
                    <div className="text-base text-gray-500">{t.role}</div>
                  </div>
                </div>
              </footer>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
