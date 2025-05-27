
interface ResultCardProps {
  image: string;
  caption: string;
  index: number;
}

const ResultCard = ({ image, caption, index }: ResultCardProps) => {
  return (
    <div 
      className="w-80 bg-white rounded-xl shadow-lg overflow-hidden animate-bubble-enter border border-separator"
      style={{ 
        animationDelay: `${index * 0.1}s`,
        transform: 'perspective(1000px) rotateY(4deg)'
      }}
    >
      <div className="h-44 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-4xl">
        {image}
      </div>
      <div className="p-4">
        <p className="text-sm text-gray-700 font-rubik">{caption}</p>
      </div>
    </div>
  );
};

export default ResultCard;
