import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { HiUser, HiEnvelope, HiPhone, HiLockClosed, HiEye, HiEyeSlash } from 'react-icons/hi2';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phonenumber: '',
        password: '',
        password_confirmation: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Inscription" />

            <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Créer un compte
                </h2>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Rejoignez Biwai LEARN et commencez votre formation
                </p>
            </div>

            <form onSubmit={submit} className="space-y-5">
                {/* Name Field */}
                <div>
                    <InputLabel htmlFor="name" value="Nom complet" required />
                    <div className="relative mt-1">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                            <HiUser className="h-5 w-5 text-gray-400" />
                        </div>
                        <TextInput
                            id="name"
                            name="name"
                            value={data.name}
                            className="block w-full pl-10"
                            autoComplete="name"
                            isFocused={true}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Votre nom"
                            error={errors.name}
                            required
                        />
                    </div>
                    <InputError message={errors.name} className="mt-2" />
                </div>

                {/* Email Field */}
                <div>
                    <InputLabel htmlFor="email" value="Email" />
                    <div className="relative mt-1">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                            <HiEnvelope className="h-5 w-5 text-gray-400" />
                        </div>
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="block w-full pl-10"
                            autoComplete="username"
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="votre@email.com"
                            error={errors.email}
                        />
                    </div>
                    <InputError message={errors.email} className="mt-2" />
                </div>

                {/* Phone Field */}
                <div>
                    <InputLabel htmlFor="phonenumber" value="Numéro de téléphone" required />
                    <div className="relative mt-1">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                            <HiPhone className="h-5 w-5 text-gray-400" />
                        </div>
                        <TextInput
                            id="phonenumber"
                            name="phonenumber"
                            value={data.phonenumber}
                            className="block w-full pl-10"
                            autoComplete="phonenumber"
                            onChange={(e) => setData('phonenumber', e.target.value)}
                            placeholder="0X XX XX XX XX"
                            error={errors.phonenumber}
                            required
                        />
                    </div>
                    <InputError message={errors.phonenumber} className="mt-2" />
                </div>

                {/* Password Field */}
                <div>
                    <InputLabel htmlFor="password" value="Mot de passe" required />
                    <div className="relative mt-1">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                            <HiLockClosed className="h-5 w-5 text-gray-400" />
                        </div>
                        <TextInput
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={data.password}
                            className="block w-full pl-10 pr-10"
                            autoComplete="new-password"
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="••••••••"
                            error={errors.password}
                            required
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? (
                                <HiEyeSlash className="h-5 w-5" />
                            ) : (
                                <HiEye className="h-5 w-5" />
                            )}
                        </button>
                    </div>
                    <InputError message={errors.password} className="mt-2" />
                </div>

                {/* Confirm Password Field */}
                <div>
                    <InputLabel htmlFor="password_confirmation" value="Confirmer le mot de passe" required />
                    <div className="relative mt-1">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                            <HiLockClosed className="h-5 w-5 text-gray-400" />
                        </div>
                        <TextInput
                            id="password_confirmation"
                            type={showConfirmPassword ? 'text' : 'password'}
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className="block w-full pl-10 pr-10"
                            autoComplete="new-password"
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            placeholder="••••••••"
                            error={errors.password_confirmation}
                            required
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? (
                                <HiEyeSlash className="h-5 w-5" />
                            ) : (
                                <HiEye className="h-5 w-5" />
                            )}
                        </button>
                    </div>
                    <InputError message={errors.password_confirmation} className="mt-2" />
                </div>

                {/* Submit Button */}
                <PrimaryButton className="w-full justify-center py-3" disabled={processing}>
                    {processing ? (
                        <span className="flex items-center gap-2">
                            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Création en cours...
                        </span>
                    ) : (
                        "S'inscrire"
                    )}
                </PrimaryButton>

                {/* Login Link */}
                <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                    Déjà inscrit ?{' '}
                    <Link
                        href={route('login')}
                        className="font-medium text-terracotta-600 hover:text-terracotta-500 dark:text-terracotta-400 dark:hover:text-terracotta-300 transition-colors"
                    >
                        Se connecter
                    </Link>
                </p>
            </form>
        </GuestLayout>
    );
}
