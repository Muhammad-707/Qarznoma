import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { LayoutGrid, List, Plus, Search } from 'lucide-react';
import { toast } from 'sonner';

import type { RootState, AppDispatch } from '@/store/store';
import { fetchProducts, deleteProduct, setSearchQuery } from '@/reducer/UserSlice';
import type { IProduct } from '@/reducer/UserSlice';

import { UserItem } from './UserItem';
import { AddModal } from './AddModal';
import { EditModal } from './EditModal';
import { InfoModal } from './InfoModal';

export const UserList: React.FC = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  const { items, loading, searchQuery } = useSelector((state: RootState) => state.products);

  const [isTable, setIsTable] = useState<boolean>(false);
  const [maxPrice, setMaxPrice] = useState<number>(1000);

  const [modals, setModals] = useState({
    add: false,
    edit: false,
    info: false,
    delete: false,
  });

  const [activeProduct, setActiveProduct] = useState<IProduct | null>(null);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    if (items.length > 0) {
      const highestPrice = Math.max(...items.map(item => item.price));
      setMaxPrice(highestPrice > 0 ? highestPrice : 1000);
    }
  }, [items]);

  const handleOpenModal = (type: 'add' | 'edit' | 'info' | 'delete', product: IProduct | null = null) => {
    if (product) setActiveProduct(product);
    setModals(prev => ({ ...prev, [type]: true }));
  };

  const handleCloseModal = (type: 'add' | 'edit' | 'info' | 'delete') => {
    setModals(prev => ({ ...prev, [type]: false }));
  };

  const handleConfirmDelete = async () => {
    if (activeProduct) {
      const productName = isRu && activeProduct.titleRu ? activeProduct.titleRu : activeProduct.title;
      await dispatch(deleteProduct(activeProduct.id));
      toast.success(`${productName} ${t('successfully removed')}`);
      handleCloseModal('delete');
    }
  };

  const isRu = i18n.language === 'ru';
  const filteredItems = items.filter(item => {
    const titleToSearch = isRu && item.titleRu ? item.titleRu : item.title;
    const matchesSearch = titleToSearch.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = item.price <= maxPrice;
    return matchesSearch && matchesPrice;
  });

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto text-zinc-900 dark:text-zinc-50">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-8">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder={t('Search plants...')}
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-sm outline-none transition-all focus:border-[#46A358]"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto justify-end">
          <div className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 px-4 py-1.5 rounded-2xl text-sm w-full sm:w-auto">
            <span className="text-zinc-400 text-xs whitespace-nowrap">{t('Max Price')}: ${maxPrice}</span>
            <input
              type="range"
              min="0"
              max={items.length > 0 ? Math.max(...items.map(item => item.price)) : 1000}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="accent-[#46A358] w-full sm:w-32 h-1 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="flex bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50">
            <button
              type="button"
              onClick={() => setIsTable(false)}
              className={`p-2 rounded-lg transition-all ${!isTable ? 'bg-white dark:bg-zinc-800 shadow-sm text-[#46A358]' : 'text-zinc-400'}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setIsTable(true)}
              className={`p-2 rounded-lg transition-all ${isTable ? 'bg-white dark:bg-zinc-800 shadow-sm text-[#46A358]' : 'text-zinc-400'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => handleOpenModal('add')}
            className="flex items-center gap-2 bg-[#46A358] hover:bg-[#3b8b4c] text-white font-bold px-4 py-2.5 rounded-2xl text-sm shadow-sm transition-all whitespace-nowrap w-full sm:w-auto justify-center"
          >
            <Plus className="w-4 h-4" />
            {t('Add Plant')}
          </button>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#46A358]"></div>
        </div>
      )}

      {!loading && filteredItems.length === 0 && (
        <div className="text-center py-20">
          <p className="text-zinc-400 font-medium text-lg">{t('No plants match your configuration.')}</p>
        </div>
      )}

      {!loading && filteredItems.length > 0 && (
        isTable ? (
          <div className="w-full overflow-x-auto border border-zinc-100 dark:border-zinc-900 rounded-3xl bg-white dark:bg-zinc-950/40">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-zinc-100 dark:border-zinc-900 text-zinc-400 text-xs font-bold uppercase bg-zinc-50/50 dark:bg-zinc-900/20">
                  <th className="p-4 w-20">{t('Image')}</th>
                  <th className="p-4">{t('Name')}</th>
                  <th className="p-4">{t('Category')}</th>
                  <th className="p-4">{t('Price')}</th>
                  <th className="p-4 text-right">{t('Actions')}</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((product) => (
                  <UserItem
                    key={product.id}
                    product={product}
                    isTable={isTable}
                    onEdit={() => handleOpenModal('edit', product)}
                    onDelete={() => handleOpenModal('delete', product)}
                    onInfo={() => handleOpenModal('info', product)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
            {filteredItems.map((product) => (
              <UserItem
                key={product.id}
                product={product}
                isTable={isTable}
                onEdit={() => handleOpenModal('edit', product)}
                onDelete={() => handleOpenModal('delete', product)}
                onInfo={() => handleOpenModal('info', product)}
              />
            ))}
          </div>
        )
      )}

      <AddModal
        isOpen={modals.add}
        onClose={() => handleCloseModal('add')}
      />

      <EditModal
        isOpen={modals.edit}
        onClose={() => handleCloseModal('edit')}
        product={activeProduct}
      />

      <InfoModal
        isOpen={modals.info}
        onClose={() => handleCloseModal('info')}
        product={activeProduct}
      />

      {modals.delete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-zinc-950 rounded-3xl max-w-sm w-full p-6 border border-zinc-200 dark:border-zinc-900 shadow-xl">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-2">
              {t('Are you absolutely sure?')}
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
              {t('This action will remove')}{' '}
              <span className="font-bold text-zinc-900 dark:text-zinc-100">
                "{activeProduct ? (isRu && activeProduct.titleRu ? activeProduct.titleRu : activeProduct.title) : ''}"
              </span>{' '}
              {t('from your shopping cart.')}
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => handleCloseModal('delete')}
                className="px-4 py-2 rounded-xl text-sm font-semibold border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all"
              >
                {t('Cancel')}
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl text-sm font-semibold bg-[#FF3B30] hover:bg-[#e03126] text-white shadow-sm transition-all"
              >
                {t('Delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};