// Satisfaction.tsx
import React, { useState, useEffect } from 'react';
import { UtensilsCrossedIcon } from "lucide-react"

interface RatingOption {
  value: number;
  emoji: string;
  label: string;
}

export const Satisfaction: React.FC = () => {
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(5);

  const ratingOptions: RatingOption[] = [
    { value: 1, emoji: '😠', label: 'Péssimo' },
    { value: 2, emoji: '😕', label: 'Ruim' },
    { value: 3, emoji: '😐', label: 'Regular' },
    { value: 4, emoji: '😊', label: 'Bom' },
    { value: 5, emoji: '😍', label: 'Excelente' }
  ];

  const handleRatingClick = (rating: number): void => {
    setSelectedRating(rating);
    
    setTimeout(() => {
      setShowModal(true);
      setCountdown(10);
    }, 500);
  };

  useEffect(() => {
    let timer: number | undefined;
    
    if (showModal && countdown > 0) {
      timer = window.setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (showModal && countdown === 0) {
      setShowModal(false);
      setSelectedRating(null);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [showModal, countdown]);

  return (
    <div className="min-h-screen flex justify-center items-center p-5">
        <div className="relative bg-[#262626] rounded-xl p-8 md:p-10 max-w-4xl w-full text-center overflow-hidden border border-gray-700">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-600 via-red-400 via-blue-400 to-blue-600" />
            <div className="flex flex-col md:flex-row items-center justify-center mb-6 pb-6 border-b border-gray-700 gap-4">
                <div className="flex items-center gap-3">
                    <div className="text-2xl text-red-500"><UtensilsCrossedIcon /></div>
                    <div className="text-2xl font-bold text-red-500">Smart Order</div>
                </div>
                <div className="text-sm text-gray-400 font-medium md:ml-3 md:pl-3 md:border-l md:border-gray-600">Enterprise</div>
            </div>
        
            <h1 className="text-white mb-3 font-semibold text-2xl font-family">Avalie sua experiência</h1>
            <p className="text-gray-400 mb-8 text-base">Como foi sua visita ao nosso restaurante?</p>
            
            <div className="flex flex-col md:flex-row justify-between gap-4 my-10">
                {ratingOptions.map((option) => (
                    <div
                        key={option.value}
                        className={`flex-1 py-4 px-2 cursor-pointer transition-all duration-300 rounded-xl border-2 ${
                            selectedRating === option.value
                            ? 'bg-green-500 bg-opacity-15 transform scale-105 border-green-500 shadow-lg'
                            : 'bg-gray-700 bg-opacity-50 border-transparent hover:bg-red-500 hover:bg-opacity-10 hover:-translate-y-2 hover:border-red-500'
                        }`} onClick={() => handleRatingClick(option.value)}>

                        <div className={`text-5xl mb-3 transition-all duration-300 ${
                            selectedRating === option.value ? 'transform scale-110' : 'hover:scale-125'
                        }`}>
                            {option.emoji}
                        </div>
                        <div className="font-medium text-white mt-2">{option.label}</div>
                    </div>
                ))}
            </div>
        </div>
      
        {/* Modal de Agradecimento - Mais Largo */}

        <div className={`fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 transition-all duration-300 ${
            showModal ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}>
            <div className={`bg-gray-800 rounded-xl p-8 md:p-10 max-w-3xl w-11/12 text-center border border-gray-700 shadow-2xl transition-transform duration-500 ${
                showModal ? 'transform translate-y-0' : 'transform translate-y-8'
            }`}>
                <div className="text-7xl mb-6 text-green-500">🙏</div>
                <h2 className="text-green-500 font-semibold mb-4 text-3xl">Obrigado pela sua avaliação!</h2>
                <p className="text-white leading-relaxed mb-6 text-3xl">
                    Sua opinião é muito importante para que possamos melhorar o atendimento e 
                    a experiência em nosso restaurante. Valorizamos cada feedback e estamos 
                    sempre trabalhando para oferecer o melhor serviço.
                </p>
                <div className="font-semibold text-orange-500 text-lg mt-4">
                    Retornando em {countdown} segundo{countdown !== 1 ? 's' : ''}...
                </div>
            </div>
        </div>
    </div>
  );
};
