import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { HiOutlinePhone, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeSlash } from 'react-icons/hi2';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        phonenumber: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    // Animation variants for Framer Motion
    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <GuestLayout>
            <Head title="Connexion" />

            {/* Status Message */}
            {status && (
                <motion.div
                    className="mb-4 p-3 text-sm font-medium text-green-700 bg-green-100 dark:bg-green-900/30 dark:text-green-300 rounded-lg"
                    initial="hidden"
                    animate="visible"
                    variants={itemVariants}
                >
                    {status}
                </motion.div>
            )}

            {/* Login Form */}
            <motion.form
                onSubmit={submit}
                className="space-y-5"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                {/* Phone Number Field */}
                <motion.div variants={itemVariants}>
                    <InputLabel
                        htmlFor="phonenumber"
                        value="Numéro de téléphone"
                        className="text-gray-700 dark:text-gray-300 font-medium"
                    />
                    <div className="relative mt-1.5">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <HiOutlinePhone className="h-5 w-5 text-gray-400" />
                        </div>
                        <TextInput
                            id="phonenumber"
                            name="phonenumber"
                            value={data.phonenumber}
                            className="pl-11"
                            autoComplete="tel"
                            placeholder="Entrez votre numéro"
                            onChange={(e) => setData('phonenumber', e.target.value)}
                            error={errors.phonenumber}
                            required
                        />
                    </div>
                    <InputError
                        message={errors.phonenumber}
                        className="mt-1.5"
                    />
                </motion.div>

                {/* Password Field */}
                <motion.div variants={itemVariants}>
                    <InputLabel
                        htmlFor="password"
                        value="Mot de passe"
                        className="text-gray-700 dark:text-gray-300 font-medium"
                    />
                    <div className="relative mt-1.5">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <HiOutlineLockClosed className="h-5 w-5 text-gray-400" />
                        </div>
                        <TextInput
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={data.password}
                            className="pl-11 pr-11"
                            autoComplete="current-password"
                            placeholder="Entrez votre mot de passe"
                            onChange={(e) => setData('password', e.target.value)}
                            error={errors.password}
                            required
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? (
                                <HiOutlineEyeSlash className="h-5 w-5" />
                            ) : (
                                <HiOutlineEye className="h-5 w-5" />
                            )}
                        </button>
                    </div>
                    <InputError
                        message={errors.password}
                        className="mt-1.5"
                    />
                </motion.div>

                {/* Remember Me Checkbox */}
                <motion.div
                    className="flex items-center justify-between"
                    variants={itemVariants}
                >
                    <label className="flex items-center cursor-pointer group">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData('remember', e.target.checked)
                            }
                            className="rounded border-gray-300 text-terracotta-600 focus:ring-terracotta-500 dark:border-gray-600 dark:bg-gray-700"
                        />
                        <span className="ms-2 text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors">
                            Se souvenir de moi
                        </span>
                    </label>

                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="text-sm text-terracotta-600 hover:text-terracotta-700 dark:text-terracotta-400 dark:hover:text-terracotta-300 font-medium transition-colors"
                        >
                            Mot de passe oublié?
                        </Link>
                    )}
                </motion.div>

                {/* Submit Button */}
                <motion.div variants={itemVariants}>
                    <PrimaryButton
                        className="w-full justify-center"
                        disabled={processing}
                    >
                        {processing ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Connexion...
                            </span>
                        ) : (
                            'Se connecter'
                        )}
                    </PrimaryButton>
                </motion.div>
            </motion.form>
        </GuestLayout>
    );
}
