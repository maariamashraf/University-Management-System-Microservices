import { motion } from 'framer-motion';
import { getRandomColor, getAvatarInitials } from '../../utils/avatarUtils';

interface FeedBackCardProps {
    name: string;
    description: string;
    role: string;
}

export default function FeedBackCard({ name, description, role }: FeedBackCardProps) {
    const randomColor = getRandomColor();
    const nameImage = getAvatarInitials(name);

    return (
        <>
            <motion.div
                whileHover={{
                    scale: 1.05,
                    boxShadow: "10px 10px 10px 0 rgba(0, 0, 0, 0.4)",
                }}
                transition={{ duration: 0.03 }}
                className='flex flex-col  bg-white rounded-lg p-6 shadow-md w-full '
            >
                <div className='flex items-center gap-4 justify-start'>

                    <div className="w-10 h-10 text-2xl font-bold text-white rounded-full flex items-center justify-center" style={{ backgroundColor: randomColor }}>
                        {nameImage}
                    </div>

                    <div className='flex flex-col'>
                        <h3 className="text-lg font-bold">{name}</h3>
                        <p className="text-sm text-gray-500">{role}</p>
                    </div>

                </div>
                <div className='flex items-center  justify-start text-yellow-300'>
                    <p className='text-3xl font-bold '>
                        &rdquo;
                    </p>
                    <p className='text-3xl font-bold'>
                        &rdquo;
                    </p>
                </div>
                <div>
                    <p className="text-lg text-gray-500">{description}</p>
                </div>
            </motion.div>
        </>
    )
}