<?php

namespace App\Rules;

class ValidationRules
{
    /**
     * Common image validation rules
     *
     * @param int $maxSize Max size in KB (default 2MB)
     * @return string
     */
    public static function image(int $maxSize = 2048): string
    {
        return "nullable|image|mimes:jpeg,png,jpg,gif,webp|max:{$maxSize}";
    }

    /**
     * Common video validation rules
     *
     * @param int $maxSize Max size in KB (default 100MB)
     * @return string
     */
    public static function video(int $maxSize = 102400): string
    {
        return "nullable|file|mimes:mp4,mov,avi,wmv,webm|max:{$maxSize}";
    }

    /**
     * Title validation rules
     *
     * @param int $maxLength
     * @return string
     */
    public static function title(int $maxLength = 255): string
    {
        return "required|string|max:{$maxLength}";
    }

    /**
     * Description validation rules
     *
     * @param int $maxLength
     * @return string
     */
    public static function description(int $maxLength = 5000): string
    {
        return "nullable|string|max:{$maxLength}";
    }

    /**
     * Date range validation rules
     *
     * @return array
     */
    public static function dateRange(): array
    {
        return [
            'date_debut' => 'required|date',
            'date_fin' => 'required|date|after_or_equal:date_debut',
        ];
    }

    /**
     * Boolean validation rules
     *
     * @return string
     */
    public static function boolean(): string
    {
        return 'required|boolean';
    }

    /**
     * Get custom validation messages
     *
     * @return array
     */
    public static function messages(): array
    {
        return [
            'date_fin.after_or_equal' => 'The end date must be equal to or after the start date.',
            'image.max' => 'The image must not be larger than 2MB.',
            'video.max' => 'The video must not be larger than 100MB.',
            'title.required' => 'The title field is required.',
            'title.max' => 'The title must not exceed :max characters.',
        ];
    }
}
