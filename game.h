#ifndef BLOCKCILLIN_GAME_H_
#define BLOCKCILLIN_GAME_H_

#include <iostream>
#include "SDL2/SDL.h"

class Game {
 public:
  int Run();

 private:
  int Init();
  void Loop();
  void Quit();

  static void LogSDLError(const std::string &tag);

  SDL_Window *window;
};

#endif // BLOCKCILLIN_GAME_H_
