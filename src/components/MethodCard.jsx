import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

const MethodCard = ({ title, description, icon, to, variants }) => {
  return (
    <motion.div 
      variants={variants}
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      <div className="p-6">
        <div className="rounded-full bg-blue-50 w-12 h-12 flex items-center justify-center text-blue-600 mb-4">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{description}</p>
        <Link 
          to={to} 
          className="flex items-center text-blue-600 font-medium hover:text-blue-800 transition-colors"
        >
          <span>Explore Method</span>
          <ChevronRight size={18} className="ml-1" />
        </Link>
      </div>
    </motion.div>
  );
};

export default MethodCard;