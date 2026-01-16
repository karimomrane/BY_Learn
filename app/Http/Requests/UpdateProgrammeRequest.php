<?php

namespace App\Http\Requests;

use App\Rules\ValidationRules;
use Illuminate\Foundation\Http\FormRequest;

class UpdateProgrammeRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('programme'));
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title'       => ValidationRules::title(),
            'description' => ValidationRules::description(),
            'image_path'  => ValidationRules::image(),
            'controle'    => 'nullable|boolean',
            ...ValidationRules::dateRange(),
        ];
    }

    /**
     * Get custom error messages for validation rules.
     */
    public function messages(): array
    {
        return ValidationRules::messages();
    }
}
