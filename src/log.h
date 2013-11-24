#ifndef BLOCKCILLIN_LOG_H_
#define BLOCKCILLIN_LOG_H_

#include <stdio.h>
#include <string>
#include "GL/glew.h"

class Log {
 public:
  Log(const std::string &tag);
  void Infof(const char* format, ...) const;
  void Errorf(const char* format, ...) const;
  void ErrorSDL(const char* message) const;
  void ErrorGLEW(const char* message, const GLenum error) const;

 private:
  void VLogf(const char* format, va_list args) const;

  const std::string tag_;
};

#endif // BLOCKCILLIN_LOG_H_
