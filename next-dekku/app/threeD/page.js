'use client';

import { useState } from 'react';
import ThreeDNavBar from '../components/ThreeDNavBar';
import ThreeDScene from '../components/ThreeDScene';
import SelectedProducts from '../components/SelectedProducts';
import ThreeDMainContent from '../components/ThreeDMainContent';

const ThreeDPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('모니터');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const addProduct = (product) => {
    setSelectedProducts([...selectedProducts, product]);
  };

  const removeProduct = (index) => {
    setSelectedProducts(selectedProducts.filter((_, i) => i !== index));
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <ThreeDNavBar
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        addProduct={addProduct}
        searchTerm={searchTerm}
        onSearch={handleSearch}
      />
      <div className="flex flex-col flex-grow relative border-l-2 border-gray-300">
        <div className="flex-grow h-4/5 overflow-hidden">
          <ThreeDScene selectedProducts={selectedProducts} />
        </div>
        <div className="h-1/5 overflow-auto">
          <SelectedProducts
            selectedProducts={selectedProducts}
            removeProduct={removeProduct}
          />
        </div>
      </div>
    </div>
  );
};

export default ThreeDPage;
