Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  #root to: redirect('/todos')

  delete '/todos/destroy_all', to: 'todos#destroy_all'
  resources :todos
end
