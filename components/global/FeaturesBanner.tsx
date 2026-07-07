import { MapPin, FileText, Mail, Users } from 'lucide-react';

export default function FeaturesBanner() {
    const contacts = [
        {
            icon: <MapPin className="w-6 h-6 md:w-8 md:h-8 text-gray-500" />,
            title: "Store Location",
            description: "50 Maltby CCT, Wanniassa, ACT-2903, Australia"
        },
        {
            icon: <FileText className="w-6 h-6 md:w-8 md:h-8 text-gray-500" />,
            title: "ABN (Company Reg.)",
            description: "88 407 290 295 | Triangle Cart Pvt Ltd"
        },
        {
            icon: <Mail className="w-6 h-6 md:w-8 md:h-8 text-gray-500" />,
            title: "Support Desk",
            description: "contact@10xminds.dev | 24/7 Helpline"
        },
        {
            icon: <Users className="w-6 h-6 md:w-8 md:h-8 text-gray-500" />,
            title: "Management Team",
            description: "Directors: Sarith Chandran & Shyno Thomas"
        }
    ];

    return (
        <div className="w-full bg-white border-t border-gray-100 py-6 md:py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 md:gap-y-0 md:divide-x divide-gray-100">
                    {contacts.map((contact, index) => (
                        <div
                            key={index}
                            className={`flex flex-col items-center text-center px-4 ${
                                // Remove left padding for the first item on desktop to keep it flush
                                index === 0 ? 'md:pl-0' : ''
                                } ${
                                // Remove right padding for the last item
                                index === contacts.length - 1 ? 'md:pr-0' : ''
                                }`}
                        >
                            <div className="mb-2 md:mb-3 bg-gray-50 p-2.5 rounded-full">
                                {contact.icon}
                            </div>
                            <h4 className="text-[12px] md:text-sm font-semibold text-gray-900 mb-0.5 uppercase tracking-wider">
                                {contact.title}
                            </h4>
                            <p className="text-[12px] md:text-xs font-medium text-gray-500 max-w-[200px] leading-relaxed">
                                {contact.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}