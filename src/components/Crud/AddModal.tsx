import React from 'react';
import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import type { AppDispatch } from '@/store/store';
import { addProduct } from '@/reducer/UserSlice';
import { X } from 'lucide-react';

interface IModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddModal: React.FC<IModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();

  const formik = useFormik({
    initialValues: {
      title: '',
      titleRu: '',
      description: '',
      descriptionRu: '',
      category: 'House Plants',
      price: '',
      oldPrice: '',
      imgUrl: '',
    },
    validationSchema: Yup.object({
      title: Yup.string().required(),
      titleRu: Yup.string().required(),
      description: Yup.string(),
      descriptionRu: Yup.string(),
      category: Yup.string().required(),
      price: Yup.number().positive().required(),
      oldPrice: Yup.number().positive().nullable(),
      imgUrl: Yup.string().url().nullable(),
    }),
    onSubmit: (values, { resetForm }) => {
      const priceNum = Number(values.price);
      const oldPriceNum = values.oldPrice ? Number(values.oldPrice) : null;
      
      dispatch(addProduct({
        title: values.title,
        titleRu: values.titleRu,
        description: values.description,
        descriptionRu: values.descriptionRu,
        category: values.category,
        size: "Medium",
        price: priceNum,
        oldPrice: oldPriceNum,
        discount: oldPriceNum ? `${Math.round(((oldPriceNum - priceNum) / oldPriceNum) * 100)}% OFF` : null,
        rating: 5.0,
        reviews: 0,
        sku: String(Math.floor(100000000000 + Math.random() * 900000000000)),
        tags: ["Indoor"],
        images: [values.imgUrl || "https://images.unsplash.com/photo-1592150621744-aca64f48394a?q=80&w=500"],
        stock: 10,
        featured: false,
        popular: false,
        createdAt: new Date().toISOString()
      }));

      resetForm();
      onClose();
    },
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-zinc-950 rounded-3xl max-w-md w-full p-6 relative border border-zinc-200 dark:border-zinc-800 max-h-[90vh] overflow-y-auto">
        <button type="button" onClick={onClose} className="absolute right-4 top-4 text-zinc-400 hover:text-zinc-600">
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold mb-4">Add New Plant</h2>
        
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1">Title (EN)</label>
              <input 
                type="text" 
                name="title"
                value={formik.values.title} 
                onChange={formik.handleChange} 
                onBlur={formik.handleBlur}
                className={`w-full p-2 rounded-xl border bg-transparent text-sm outline-none ${formik.touched.title && formik.errors.title ? 'border-red-500' : 'dark:border-zinc-800'}`} 
              />
            </div>
            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1">Название (RU)</label>
              <input 
                type="text" 
                name="titleRu"
                value={formik.values.titleRu} 
                onChange={formik.handleChange} 
                onBlur={formik.handleBlur}
                className={`w-full p-2 rounded-xl border bg-transparent text-sm outline-none ${formik.touched.titleRu && formik.errors.titleRu ? 'border-red-500' : 'dark:border-zinc-800'}`} 
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-zinc-400 block mb-1">Description (EN)</label>
            <textarea 
              name="description"
              value={formik.values.description} 
              onChange={formik.handleChange} 
              onBlur={formik.handleBlur}
              className={`w-full p-2 rounded-xl border bg-transparent text-sm outline-none h-16 resize-none ${formik.touched.description && formik.errors.description ? 'border-red-500' : 'dark:border-zinc-800'}`} 
            />
          </div>

          <div>
            <label className="text-xs font-bold text-zinc-400 block mb-1">Описание (RU)</label>
            <textarea 
              name="descriptionRu"
              value={formik.values.descriptionRu} 
              onChange={formik.handleChange} 
              onBlur={formik.handleBlur}
              className={`w-full p-2 rounded-xl border bg-transparent text-sm outline-none h-16 resize-none ${formik.touched.descriptionRu && formik.errors.descriptionRu ? 'border-red-500' : 'dark:border-zinc-800'}`} 
            />
          </div>

          <div>
            <label className="text-xs font-bold text-zinc-400 block mb-1">Category</label>
            <select 
              name="category"
              value={formik.values.category} 
              onChange={formik.handleChange} 
              onBlur={formik.handleBlur}
              className="w-full p-2 rounded-xl border dark:border-zinc-800 bg-transparent text-sm outline-none"
            >
              <option value="House Plants">House Plants</option>
              <option value="Potter Plants">Potter Plants</option>
              <option value="Succulents">Succulents</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1">Price ($)</label>
              <input 
                type="number" 
                name="price"
                value={formik.values.price} 
                onChange={formik.handleChange} 
                onBlur={formik.handleBlur}
                className={`w-full p-2 rounded-xl border bg-transparent text-sm outline-none ${formik.touched.price && formik.errors.price ? 'border-red-500' : 'dark:border-zinc-800'}`} 
              />
            </div>
            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1">Old Price ($)</label>
              <input 
                type="number" 
                name="oldPrice"
                value={formik.values.oldPrice} 
                onChange={formik.handleChange} 
                onBlur={formik.handleBlur}
                className="w-full p-2 rounded-xl border dark:border-zinc-800 bg-transparent text-sm outline-none" 
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-zinc-400 block mb-1">Image URL</label>
            <input 
              type="text" 
              name="imgUrl"
              value={formik.values.imgUrl} 
              onChange={formik.handleChange} 
              onBlur={formik.handleBlur}
              className={`w-full p-2 rounded-xl border bg-transparent text-sm outline-none ${formik.touched.imgUrl && formik.errors.imgUrl ? 'border-red-500' : 'dark:border-zinc-800'}`} 
              placeholder="https://..." 
            />
          </div>

          <button type="submit" className="bg-[#46A358] text-white font-bold py-2.5 rounded-xl mt-2 hover:bg-[#3b8b4c] transition-all">
            Save Plant
          </button>
        </form>
      </div>
    </div>
  );
};