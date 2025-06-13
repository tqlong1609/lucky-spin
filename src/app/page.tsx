"use client";
import { ModalWithCanvasConfetti, ModalWithCanvasConfettiRef } from "../../components/ModalWithCanvasConfetti";
import SpinWheelWrapper from "../../react-spin/SpinWheelWrapper";
import { useRef, useState } from "react";

interface WheelRef {
  handleSpinClick: (index: number, callback: (index: number) => void) => void;
  data?: { label: string }[];
}

export default function Home() {
  const wheelRef = useRef<WheelRef>(null);
  const modalRef = useRef<ModalWithCanvasConfettiRef>(null);

  const [wheelData, setWheelData] = useState<{ label: string }[]>([]);
  const [newPrize, setNewPrize] = useState("");
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);

  const handleAddPrize = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPrize.trim()) {
      setWheelData([...wheelData, { label: newPrize.trim() }]);
      setNewPrize("");
    }
  };

  const handleSubmitData = () => {
    if (wheelData.length >= 2) {
      setIsDataSubmitted(true);
    } else {
      alert("Please add at least 2 prizes before spinning!");
    }
  };

  const handleSpin = () => {
    if (wheelRef.current) {
      const restrictedTerms = ['front end', 'fe', 'frontend', 'front', 'font'];

      // Filter out restricted prizes
      const allowedPrizes = wheelData.filter(prize =>
        !restrictedTerms.some(term =>
          prize.label.toLowerCase().includes(term.toLowerCase())
        )
      );

      let originalIndex = 0;

      if (allowedPrizes.length === 0) {
        originalIndex = Math.floor(Math.random() * wheelData.length);
      } else {
        const randomIndex = Math.floor(Math.random() * allowedPrizes.length);
        const selectedPrize = allowedPrizes[randomIndex];
        originalIndex = wheelData.findIndex(prize => prize.label === selectedPrize.label);
      }



      wheelRef.current.handleSpinClick(originalIndex, (winningIndex: number) => {
        modalRef.current?.open({ content: `Xin chúc mừng: ${wheelData[winningIndex].label}` });
      });
    }
  };

  const resetWheel = () => {
    setWheelData([]);
    setIsDataSubmitted(false);
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-center">Lucky Spin Wheel</h1>

        {!isDataSubmitted ? (
          <div className="w-full max-w-md space-y-4">
            <form onSubmit={handleAddPrize} className="flex gap-2">
              <input
                type="text"
                value={newPrize}
                onChange={(e) => setNewPrize(e.target.value)}
                placeholder="Enter prize name"
                className="flex-1 px-4 py-2 border rounded-lg"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Add Prize
              </button>
            </form>

            <div className="space-y-2">
              <h2 className="font-semibold">Added Prizes:</h2>
              <ul className="list-disc pl-5">
                {wheelData.map((prize, index) => (
                  <li key={index}>{prize.label}</li>
                ))}
              </ul>
            </div>

            <button
              onClick={handleSubmitData}
              className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Start Spinning
            </button>
          </div>
        ) : (
          <>
            {/* @ts-expect-error - This is a workaround to fix the type error */}
            <SpinWheelWrapper ref={wheelRef} data={wheelData} />

            <div className="flex gap-4">
              <button
                onClick={handleSpin}
                className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-[#2c2c2c] text-[#f0f0f0] gap-2 hover:bg-[#1a1a1a]  font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto cursor-pointer"
              >
                Spin the Wheel!
              </button>
              <button
                onClick={resetWheel}
                className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-red-500 text-white gap-2 hover:bg-red-600 font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto cursor-pointer"
              >
                Reset
              </button>
            </div>
          </>
        )}
      </main>
      <ModalWithCanvasConfetti ref={modalRef} />
    </div>
  );
}
