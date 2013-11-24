#ifndef BLOCKCILLIN_LOG_H_
#define BLOCKCILLIN_LOG_H_

#include <string>
#include "GL/glew.h"

class Log {
 public:
  Log(const std::string &tag);

  void Info(const char* format, ...) const;
  void Error(const char* format, ...) const;

  static void ErrorSDL(const std::string &tag);
  static void ErrorGLEW(const std::string &tag, const GLenum error);
  static void ErrorGL(const std::string &tag, const GLuint error);

 private:
  const std::string tag_;
};

#endif // BLOCKCILLIN_LOG_H_
