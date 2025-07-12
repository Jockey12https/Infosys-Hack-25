import React from 'react';
import { Leaf, Wheat, Palette, Mountain, Utensils, BookOpen } from 'lucide-react';

const ExperienceCategories = () => {
  const categories = [
    {
      icon: Wheat,
      title: 'A Day with Artisans',
      description: 'Learn traditional art forms and cultural exchange',
      image: 'https://www.keralatourism.org/responsible-tourism/packages/uploads/a-day-with-artisans.jpg',
      experiences: 23
    },
    {
      icon: Leaf,
      title: 'At top of Kolukkumalae',
      description: 'Experience the altitude of nature',
      image: 'https://www.keralatourism.org/responsible-tourism/packages/uploads/at-top-kolukkumalai.jpg',
      experiences: 18
    },
    {
      icon: Palette,
      title: 'Traditional Crafts Village',
      description: 'Master local handicrafts',
      image: 'https://en-media.thebetterindia.com/uploads/2017/03/village_f.jpg',
      experiences: 31
    },
    {
      icon: Mountain,
      title: 'Nature Walks',
      description: 'Explore hidden trails and local wildlife',
      image: 'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=400',
      experiences: 42
    },
    {
      icon: Utensils,
      title: 'Traditional Cooking',
      description: 'Cook authentic village recipes with local ingredients',
      image: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=400',
      experiences: 27
    },
    {
      icon: BookOpen,
      title: 'Local Storytelling',
      description: 'Hear ancient tales and village folklore',
      image: 'https://images.pexels.com/photos/1181472/pexels-photo-1181472.jpeg?auto=compress&cs=tinysrgb&w=400',
      experiences: 15
    }
  ];

  return (
    <section className="py-16 bg-stone-50" id="experiences">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Authentic Village Experiences
          </h2>
          <p className="text-xl text-gray-600">
            Immerse yourself in traditional activities led by local experts
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer group"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={category.image}
                  alt={category.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-opacity duration-300"></div>
                <div className="absolute top-4 right-4 bg-white bg-opacity-90 px-3 py-1 rounded-full text-sm font-semibold text-gray-900">
                  {category.experiences} experiences
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-orange-100 p-3 rounded-full">
                    <category.icon className="h-6 w-6 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 ml-4">
                    {category.title}
                  </h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  {category.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExperienceCategories;