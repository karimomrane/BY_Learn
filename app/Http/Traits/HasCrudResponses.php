<?php

namespace App\Http\Traits;

trait HasCrudResponses
{
    /**
     * Return success response with redirect
     *
     * @param string $route
     * @param array $routeParams
     * @param string $message
     * @return \Illuminate\Http\RedirectResponse
     */
    protected function successResponse(string $route, array $routeParams = [], string $message = 'Operation completed successfully.')
    {
        return redirect()->route($route, $routeParams)
                         ->with('success', $message);
    }

    /**
     * Return error response with redirect back
     *
     * @param string $message
     * @param bool $withInput
     * @return \Illuminate\Http\RedirectResponse
     */
    protected function errorResponse(string $message, bool $withInput = true)
    {
        $response = redirect()->back()->with('error', $message);

        if ($withInput) {
            $response = $response->withInput();
        }

        return $response;
    }

    /**
     * Return validation error response
     *
     * @param array $errors
     * @return \Illuminate\Http\RedirectResponse
     */
    protected function validationErrorResponse(array $errors)
    {
        return redirect()->back()
                         ->withInput()
                         ->withErrors($errors);
    }
}
